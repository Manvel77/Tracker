const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now(), required: true },
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction
