const express = require('express');
const router = express.Router();
const {authenticateUser, authorizeRoles} = require('../../../middlewares/auth');
const { index } = require('./controller');

router.get('/orders', authenticateUser, authorizeRoles('organizer', 'admin', 'owner'), index);

module.exports = router;