import React, { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8088/register', userData);
            console.log(response.data);
            navigate("/");
        } catch (error) {
            console.error("Error during registration:", error);
            if (error.response.data.errors) setError(error.response?.data?.errors[0].msg);
            else {setError(error.response?.data?.message);}
        }
    };


    return (
        <div className="register-container">
            <h1>Register</h1>
            {error && <p className='error-message'>{error}</p>}
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    name="username"
                    placeholder="Full Name"
                    value={userData.name}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={userData.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <Link to="/">Login here</Link>
            </p>
        </div>
    );
}

export default Register;
