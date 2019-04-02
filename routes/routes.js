const router = require('express').Router();

const indexRouter = require('./index');
const transactionsRouter = require('./transactions');

router.use('/', indexRouter);
router.use('/transactions', transactionsRouter);

module.exports = router;