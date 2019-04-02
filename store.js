
const uuid = require('uuid/v4');

class Account {

    constructor() {
        this.amount = 0;
        this.history = [];
        this.blocked = false;
    }

    async getTransactionHistory() {
        await this._untilBlocked();

        return this.history;
    }

    async getCurrentAmount() {
        await this._untilBlocked();

        return this.amount;
    }

    async commitTransaction({ type, amount }) {
        let action;
        if (type === 'credit') {
            action = this._creditTransaction;
        } else if (type === 'debit') {
            action = this._debitTransaction;
        } else {
            throw new Error('wrong action');
        }

        await this._untilBlocked();
        this.blocked = true;
        const transaction = await action.call(this, amount);

        return transaction;
    }

    _creditTransaction(amount) {
        return new Promise((resolve, reject) => {
            if (this.amount - amount < 0) {
                reject('transaction refused');
            }
    
            this.amount -= amount;
            const transaction = this._saveTransaction('credit', amount);

            setTimeout(() => resolve(transaction), 100);
        });
    }

    _debitTransaction(amount) {
        return new Promise(resolve => {
            this.amount += amount;
            const transaction = this._saveTransaction('debit', amount);

            setTimeout(() => resolve(transaction), 100);
        });
    }

    async getTransactionById(id) {
        if (this._isIdValid(id)) {
            const transaction = this.history.find(transaction => transaction.id === id);
            return transaction;
        }

        throw new Error('invalid ID supplied');
    }

    _isIdValid(id) {
        const v4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
        return typeof id === 'string' && id.match(v4);
    }

    _saveTransaction(type, amount) {
        const effectiveDate = new Date().toISOString();
        const id = uuid();

        const transaction =  {
            id,
            type,
            amount,
            effectiveDate
        };

        this.history.push(transaction);
        this.blocked = false;

        return transaction;
    }

    async _untilBlocked() {
        while (true){
            if (!this.blocked) {
                return;
            }
            await null;
       }
    }

}

const ACCOUNT_KEY = Symbol.for('App.Account');
global[ACCOUNT_KEY] = new Account();

const singleton = {};
Object.defineProperty(singleton, "instance", {
  get: function() {
    return global[ACCOUNT_KEY];
  }
});
Object.freeze(singleton);

module.exports = singleton;