"use client";

import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../components/App.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionName, setTransactionName] = useState("");
  const [transactionType, setTransactionType] = useState("expense");
  const [transactionCategory, setTransactionCategory] = useState("Food");
  const [transactions, setTransactions] = useState([]); // Array to store all transactions

  const categories = ["Food", "Fun", "Rent", "Utilities", "Transport", "Health", "Misc"];

  const handleAddTransaction = () => {
    if (!transactionName || !transactionAmount) {
      alert("Please provide a name and amount for the transaction.");
      return;
    }

    const newTransaction = {
      name: transactionName,
      amount: Number(transactionAmount),
      type: transactionType,
      category: transactionCategory,
      date: new Date().toLocaleString(), 
    };

    setTransactions([...transactions, newTransaction]);

    if (transactionType === "income") {
      setIncome(income + Number(transactionAmount));
    } else if (transactionType === "expense") {
      setExpenses(expenses + Number(transactionAmount));
    }

    setTransactionAmount(0);
    setTransactionName("");
  };

  const handleDeleteTransaction = (index) => {
    const updatedTransactions = transactions.filter((_, i) => i !== index);
    setTransactions(updatedTransactions);

    const newIncome = updatedTransactions
      .filter(transaction => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const newExpenses = updatedTransactions
      .filter(transaction => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    setIncome(newIncome);
    setExpenses(newExpenses);
  };

  const handleEditTransaction = (index) => {
    const transaction = transactions[index];
    setTransactionName(transaction.name);
    setTransactionAmount(transaction.amount);
    setTransactionType(transaction.type);
    setTransactionCategory(transaction.category);

    handleDeleteTransaction(index);
  };

  const categoryTotals = categories.reduce((acc, category) => {
    acc[category] = transactions
      .filter((transaction) => transaction.category === category && transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return acc;
  }, {});

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: categories.map((category) => categoryTotals[category] || 0),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#F7464A", "#8E44AD", "#E74C3C",
        ],
        hoverBackgroundColor: [
          "#FF4D6A", "#33A1D3", "#FFB547", "#48B8B2", "#F83C57", "#9B59B6", "#C0392B",
        ],
      },
    ],
  };

  const balance = income - expenses;

  return (
    <div className="App">
      <h1>Bank Account Tracker</h1>

      <div className="summary">
        <div className="summary-card balance">
          <h3>Balance: </h3>
          <span>${balance}</span>
        </div>
        <div className="summary-card incomes">
          <h3>Income: </h3>
          <span>${income}</span>
        </div>
        <div className="summary-card expenses">
          <h3>Expenses: </h3>
          <span>${expenses}</span>
        </div>
      </div>

      <div className="transaction-inputs">
        <div className="transaction-card">
          <label>Transaction Name: </label>
          <input
            type="text"
            value={transactionName}
            onChange={(e) => setTransactionName(e.target.value)}
            placeholder="Enter transaction name"
          />
        </div>

        <div className="transaction-card">
          <label>Transaction Amount: </label>
          <input
            type="number"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <div className="transaction-card">
          <label>Transaction Type: </label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="transaction-card">
          <label>Category: </label>
          <select
            value={transactionCategory}
            onChange={(e) => setTransactionCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button className="add-transaction-btn" onClick={handleAddTransaction}>
          Add Transaction
        </button>
      </div>

      <div className="transaction-history">
        <h2>Transaction History</h2>
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index} className={transaction.type}>
              <div className={`transaction-details ${transaction.type}`}>
                <span>{transaction.date} - </span>
                <span>{transaction.name} ({transaction.category}):</span>
                <span className="amount">
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                </span>
              </div>
              <div className="transaction-actions">
                <button className="edit-btn" onClick={() => handleEditTransaction(index)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteTransaction(index)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="chart">
        <h2>Expense Breakdown</h2>
        <Pie data={chartData} />
      </div>
    </div>
  );
}

export default App;
