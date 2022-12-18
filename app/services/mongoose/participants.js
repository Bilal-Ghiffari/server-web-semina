const Participant = require('../../api/v1/participant/model');
const Events = require('../../api/v1/events/model');
const Orders = require('../../api/v1/orders/model');
const Payments = require('../../api/v1/payments/model');

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError
} = require('../../errors');
const {createTokenParticipant, createJwt} = require('../../utils');
const {otpMAIL} = require('../mail');

const signupParticipant = async (req) => {
  const {firstName, lastName, email, password, role} = req.body;

  // jika email dan status tidak aktif
  let result = await Participant.findOne({
    email,
    status: 'tidak aktif'
  });

  let idOTP = Math.floor(Math.random() * 9999); // output = number 4 digit 3434

  if(result){
    result.firstName = firstName;
    result.lastName = lastName;
    result.role = role;
    result.email = email;
    result.password = password;
    result.otp = idOTP; 
    await result.save();
  }else {
    result = await Participant.create({
      firstName,
      lastName,
      role,
      email,
      password,
      otp: idOTP
    });
  }

  await otpMAIL(email, result);

  // delete filds pass and otp
  delete result._doc.password;
  delete result._doc.otp;

  return result;
}

const activateParticipant = async (req) => {
  const {otp, email} = req.body;
  const check = await Participant.findOne({
    email,
  });

  // console.log(typeof check.otp);

  if(!check) throw new NotFoundError('Partisipan belum terdaftar');

  if(check && check.otp !== otp) throw new BadRequestError('Kode otp salah');

  const result = await Participant.findByIdAndUpdate(
    check._id,
    {status: 'aktif'},
    {new: true}
  );

  delete result._doc.password;
  return result;
};

const signinParticipant = async (req) => {
  const {email, password} = req.body;

  if(!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  // check email
  const result = await Participant.findOne({email: email});

  if(!result) {
    throw new UnauthorizedError('Invalid Credentials');
  }

  if(result.status === 'tidak aktif') {
    throw new UnauthorizedError('Akun anda belum aktif');
  }

  const isPasswordCorrect = await result.comparePassword(password);

  if(!isPasswordCorrect){
    throw new UnauthorizedError('Invalid Credentials');
  }

  const token = createJwt({payload: createTokenParticipant(result)});

  return token;
};

const getAllEvents = async () => {
  const result = await Events.find({statusEvent: 'Published'})
    .populate('category')
    .populate('image')
    .select('_id title date tickets venueName');

  return result;
};

const getOneEvent = async (req) => {
  const {id} = req.params;
  const result = await Events.findOne({_id: id})
  .populate('category')
  .populate({path: 'talent', populate: 'image'})
  .populate('image');

  if(!result) throw new NotFoundError(`Tidak ada acara dengan id : ${id}`);

  return result;
};

const getAllOrders = async (req) => {
  console.log(req.participant);
  const result = await Orders.find({participant: req.participant.id});
  return result;
};

const checkoutOrder = async (req) => {
  const {event, personalDetail, payment, tickets} = req.body;

  const checkingEvent = await Events.findOne({_id: event});
  if(!checkingEvent) {
    throw new NotFoundError(`tidak ada acara dengan id : ${event}`);
  }

  const checkingPayment = await Payments.findOne({_id: payment});
  if(!checkingPayment){
    throw new NotFoundError(`tidak ada metode pembayaran dengan id : ${payment}`);
  }

  // algoritma payment
  // type = a
  // price = 1000
  // sumTicket = 1

  // type = b
  // price = 1000
  // sumTicket = 1

  // let total = 0;
  // total = total + (price * sumTicket);

  let totalPay = 0;
  let totalOrderTicket = 0;

  await tickets.forEach((tic) => {
    checkingEvent.tickets.forEach((ticketEvent) => {
      if(tic.ticketCategories.type === ticketEvent.type){
        // check jumlah pembelian ticket
        if(tic.sumTicket > ticketEvent.stock){
          // jumlah pmebelian ticket tidak boleh lebih dari jumlah stock ticket
          throw new NotFoundError('stock event tidak mencukupi');
        }else {
          // ketika melakukan order ticket maka stock ticket akan berkurang
          ticketEvent.stock -= tic.sumTicket;

          // update total order ticket pembayaran
          totalOrderTicket += tic.sumTicket;

          // total dari jumlah pembayaran
          totalPay += tic.ticketCategories.price * tic.sumTicket;
        }
      }
    });
  });

  await checkingEvent.save();

  // history event untuk backup data order payment
  const historyEvent = {
    title: checkingEvent.title,
    date: checkingEvent.date,
    about: checkingEvent.about,
    tagline: checkingEvent.tagline,
    keyPoint: checkingEvent.keypoint,
    venueName: checkingEvent.venueName,
    tickets: tickets,
    image: checkingEvent.image,
    category: checkingEvent.category,
    talent: checkingEvent.talent,
    organizer: checkingEvent.organizer
  };

  const result = new Orders({
    date: new Date(),
    personalDetail: personalDetail,
    totalPay,
    totalOrderTicket,
    orderItems: tickets,
    participant: req.participant.id,
    event,
    historyEvent,
    payment
  });

  await result.save();
  return result;
};


module.exports = {
  signupParticipant,
  signinParticipant,
  activateParticipant,
  getAllEvents,
  getOneEvent,
  getAllOrders,
  checkoutOrder
}