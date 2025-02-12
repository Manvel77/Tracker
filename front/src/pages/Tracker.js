import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Tracker() {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
    });
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [newTransaction, setNewTransaction] = useState({
        type: 'income',
        category: '',
        amount: '',
        date: '',
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        fetchTransactions();
        fetchBalance();
        fetchUser();
        axios.get('http://localhost:8088/categories', {
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => setCategories(response.data))
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    const fetchUser = async (req, res) => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.get('http://localhost:8088/get-user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    userId: userId,
                }
            })
            console.log(response);
            setUserData(response.data);

        }catch (error) {
            console.log(error);
        }
    }

    const fetchTransactions = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8088/transactions', {
            headers: { 'Authorization': `Bearer ${token}`, userId: localStorage.getItem('userId') }
        })
            .then(response => setTransactions(response.data))
            .catch(error => console.error("Error fetching transactions:", error));

    };

    const fetchBalance = () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:8088/user/${userId}/balance`, {headers: {"Authorization": `Bearer ${token}`, "Content-Type": 'application/json' }})
            .then(response => setBalance(response.data.balance))
            .catch(error => console.error("Error fetching balance:", error));
    };

    const handleAddTransaction = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!userId || !token) {
            console.error("User not authenticated");
            return;
        }

        const newTransactionData = {
            ...newTransaction,
            userId,
            amount: Number(newTransaction.amount),
        };

        axios.post('http://localhost:8088/transactions', newTransactionData, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                setTransactions([...transactions, response.data.transaction]);
                setBalance(response.data.balance);
                setNewTransaction({ type: 'income', category: '', amount: '', date: '' });
            })
            .catch(error => console.error("Error adding transaction:", error));
    };

    const handleDeleteTransaction = (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("No token found");
            return;
        }

        axios.delete(`http://localhost:8088/transactions/${id}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'content-type': 'application/json' }
        })
            .then(response => {
                setTransactions(transactions.filter(trans => trans._id !== id));
                setBalance(response.data.balance);
            })
            .catch(error => console.error("Error deleting transaction:", error));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div>
            <h1>{userData?.username}</h1>
            <h2>Balance: {balance} $</h2>
            <button onClick={handleLogout}>Logout</button>

            <form className="form-container">
                <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Amount"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                />
                <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                />
                <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <button onClick={handleAddTransaction}>Add Transaction</button>
            </form>

            <div>
                <h3>Transactions:</h3>
                {transactions.length > 0 ? (
                    <ul>
                        {transactions.map((trans) => (
                            <li key={trans._id}>
                                {/*{trans.date} - {trans.category}: {trans.amount} $ ({trans.type})*/}
                                {new Date(trans.date).toLocaleDateString('us-US')} - {trans.category}: {trans.amount} $ ({trans.type})
                                <button onClick={() => handleDeleteTransaction(trans._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No transactions available</p>
                )}
            </div>
        </div>
    );
}

export default Tracker;