const router = require('express').Router();
const Account = require('../store').instance;

router.get('/', async function(req, res, next) {
  try {
    const history = await Account.getTransactionHistory();

    res.status(200).send(history);
  } catch (e) {
    console.error(e);
    res.status(400).send({ message: 'invalid status value' });    
  }
});

router.post('/', async function(req, res, next) {
  try {
    const transaction = await Account.commitTransaction(req.body);

    res.status(201).send(transaction);
  } catch (e) {
    console.error(e);
    res.status(403).send({ message: 'transaction refused' });    
  }
});
 
router.get('/:id/', async function(req, res, next) {
  try {
    const transaction = await Account.getTransactionById(req.params.id);
    if (transaction) {
      return res.status(200).send(transaction);
    }

    res.status(404).send({ message: 'transaction not found' });
  } catch (e) {
    console.error(e);
    res.status(422).send({ message: 'invalid ID supplied' });
  }
});

module.exports = router;
