const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const transactionType = document.getElementById('transaction-type');
const resetBtn = document.getElementById('reset-btn');
const balanceChart = document.getElementById('balanceChart'); // Line chart canvas

const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
);

let transactions =
    localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

let chart; // To store the line chart instance

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a text and amount');
    } else {
        const sign = transactionType.value === 'expense' ? -1 : 1;

        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value * sign
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        updateChart(); // Update the chart after each transaction

        text.value = '';
        amount.value = '';
    }
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> 
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

    list.appendChild(item);
}

// Update the balance, income, and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `₹${total}`;
    money_plus.innerText = `₹${income}`;
    money_minus.innerText = `₹${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    updateChart(); // Update chart after deletion
    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to reset all transactions
function resetAllTransactions() {
    transactions = [];
    localStorage.removeItem('transactions');
    init();
    updateChart(); // Reset chart on transaction reset
}

// Initialize the app
function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues();
    updateChart(); // Initialize the chart on app start
}

// Initialize or update the Line Chart (Single Line, Changing Colors)
function updateChart() {
    const cumulativeAmounts = transactions.map((t, index) => {
        return transactions.slice(0, index + 1).reduce((sum, transaction) => sum + transaction.amount, 0);
    });

    const labels = transactions.map((_, index) => `Transaction ${index + 1}`);

    const borderColors = transactions.map(transaction => transaction.amount > 0 ? '#2ecc71' : '#e74c3c'); // Green for income, red for expenses

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Balance Over Time',
                data: cumulativeAmounts,
                borderColor: borderColors, // Line segment colors based on income/expense
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }
        ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    if (chart) {
        chart.destroy(); // Destroy previous chart instance if it exists
    }

    chart = new Chart(balanceChart, config); // Create new chart instance
}

// Event listeners
resetBtn.addEventListener('click', resetAllTransactions);
form.addEventListener('submit', addTransaction);

init();
