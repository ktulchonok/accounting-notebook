'use strict';
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/transactions/')
        .then(response => response.json())
        .then(transactions => {
            const historyBlock = document.getElementById('history');

            const transactionsList = transactions.map(transaction => {
                return `
                <div class="card">
                    <div class="card-header ${transaction.type}" id="heading_${transaction.id}">
                        <h2 class="mb-0">
                            <button class="btn btn-link" type="button"
                             data-toggle="collapse" data-target="#collapse_${transaction.id}"
                             aria-expanded="true" aria-controls="collapse_${transaction.id}">
                                ${transaction.type}  ${transaction.amount}
                            </button>
                        </h2>
                    </div>
                
                    <div id="collapse_${transaction.id}" class="collapse detail" aria-labelledby="heading_${transaction.id}"
                     data-parent="#history">
                        <div class="card-body">
                            <div>Id: ${transaction.id}</div>
                            <div>Type: ${transaction.type}</div>
                            <div>Amount: ${transaction.amount}</div>
                            <div>Effective Date: ${transaction.effectiveDate}</div>
                        </div>
                    </div>
                </div>
                `;
            });
            historyBlock.innerHTML = transactionsList.join('\n');
        })
});