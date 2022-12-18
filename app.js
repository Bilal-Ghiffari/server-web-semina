const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// import router
const categoriesRouter = require('./app/api/v1/categories/router');
const imagesRouter = require('./app/api/v1/images/router');
const talentsRouter = require('./app/api/v1/talents/router');
const eventsRouter = require('./app/api/v1/events/router');
const organizersRouter = require('./app/api/v1/organizers/router');
const AuthCMSRouter = require('./app/api/v1/auth/router');
const OrdersRouter = require('./app/api/v1/orders/router');
const PaymentsRouter = require('./app/api/v1/payments/router');
const ParticipantsRouter = require('./app/api/v1/participant/router');
const userRefreshTokenRouter = require('./app/api/v1/userRefreshToken/router');

// middlewares
const notFoundMiddleware = require('./app/middlewares/not-found');
const handleErrorMiddleware  = require('./app/middlewares/handler-error');

const app = express();
const v1 = '/api/v1';

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to api seminar'
    })
});
app.use(`${v1}/cms`, categoriesRouter);
app.use(`${v1}/cms`, imagesRouter);
app.use(`${v1}/cms`, talentsRouter);
app.use(`${v1}/cms`, eventsRouter);
app.use(`${v1}/cms`, organizersRouter);
app.use(`${v1}/cms`, AuthCMSRouter);
app.use(`${v1}/cms`, OrdersRouter);
app.use(`${v1}/cms`, PaymentsRouter);
app.use(`${v1}/cms`, userRefreshTokenRouter);

app.use(`${v1}`, ParticipantsRouter);

// middlewares harus ditaruh dibawah router
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;

//https://bwamci.notion.site/Bootcamp-Mern-2022-b829a8ee23dd437292042f6e8db60ffc

// erd
//https://lucid.app/lucidchart/81348ae5-2bac-4669-94c6-afb7bd77d429/edit?invitationId=inv_6df41283-25e8-4f80-8964-8522b23bee81&page=0_0#
