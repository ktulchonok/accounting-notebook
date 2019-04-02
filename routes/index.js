const router = require('express').Router();
const Account = require('../store').instance;

router.get('/', async function(req, res, next) {
  try {
    const amount = await Account.getCurrentAmount();

    res.status(200).send({ amount });
  } catch (e) {
    console.error(e);
    res.status(400).send({ message: 'invalid status value' });    
  }
});

module.exports = router;
