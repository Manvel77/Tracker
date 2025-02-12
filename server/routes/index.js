const express = require('express');
const router = express.Router();
const {getTransactions, addTransaction, deleteTransaction, getCategories, getBalance} = require('../controllers/TrackerController');
const { registerUser, loginUser, getUser } = require('../controllers/UserController');
const {authorization} = require("../middlewares/authorization");
const {validateRegistration} = require("../middlewares/validateRegistration");

router.get('/transactions', authorization, getTransactions);
router.post('/transactions', authorization, addTransaction);
router.delete('/transactions/:id', authorization, deleteTransaction);
router.get('/categories', authorization, getCategories);
router.get('/user/:userId/balance', authorization, getBalance);

router.get('/get-user', authorization, getUser);


router.post('/register', validateRegistration, registerUser);
router.post('/login', loginUser);

module.exports = router;
