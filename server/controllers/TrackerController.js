const Transaction = require('../models/TrackerSchema');
const User = require('../models/UserSchema');
const { Types } = require('mongoose');

class TrackerController {

    static getTransactions = async (req, res) => {
        try {
            const { userid } = req.headers;
            if (!userid) return res.status(400).json({ message: "User ID is required" });

            const transactions = await Transaction.find({ userId: new Types.ObjectId(userid) });
            res.json(transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            res.status(500).json({ message: "Server error" });
        }
    };

    static getBalance = async (req, res) => {
        try {
            const userId = req.params.userId;

            if (!userId || !Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid user ID" });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ balance: user.balance });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    static getCategories = async (req, res) => {
        const categories = ['Food', 'Rent', 'Shopping', 'Transport', 'Entertainment', 'Utilities'];
        res.json(categories);
    }

    static addTransaction = async (req, res) => {
        try {
            const { type, category, amount, date, userId } = req.body;

            if (!userId || !Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid user ID" });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const newTransaction = new Transaction({ type, category, amount, date, userId });
            await newTransaction.save();

            user.balance = type === 'income' ? user.balance + Number(amount) : user.balance - Number(amount);
            await user.save();

            res.status(201).json({ transaction: newTransaction, balance: user.balance });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    static deleteTransaction = async (req, res) => {
        try {
            const transactionId = req.params.id;

            const transaction = await Transaction.findById(transactionId);
            if (!transaction) {
                return res.status(404).json({ message: "Transaction not found" });
            }

            const user = await User.findById(transaction.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.balance = transaction.type === 'income'
                ? user.balance - transaction.amount
                : user.balance + transaction.amount;

            await user.save();
            await Transaction.findByIdAndDelete(transactionId);

            res.status(200).json({ message: "Transaction deleted", balance: user.balance });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
}

module.exports = TrackerController;
