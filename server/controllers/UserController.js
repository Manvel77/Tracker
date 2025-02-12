const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  User  = require("../models/UserSchema");

class UserController {

    static registerUser = async (req, res) => {
        const { email, username, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            balance: 0
        });

        try {
            await newUser.save();
            return res.status(201).json({ message: "user registered successfully!" });
        } catch (error) {
            console.error('error register user:', error);
            return res.status(500).json({ message: "error register user", error: error.message });
        }
    };

    static loginUser = async (req, res) => {
        const { email, password } = req.body;
        console.log(req.body);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET_KEY);

        return res.status(200).json({ message: "Login successful", token, userId: user._id });
    };

    static getUser = async (req, res) => {
        try {
            const { userid } = req.headers;
            if (!userid) return res.status(400).json({ message: "User ID is required" });

            const user = await User.findById(userid);
            console.log('User found', user);

            if (!user) return res.status(404).json({ message: "User not found" });
            return res.status(200).json({username: user.username, email: user.email});
        } catch (error) {
            console.error("Error fetching UserId:", error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = UserController;
