import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8088/login', credentials);
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);

            navigate('/tracker');
        } catch (error) {
            console.error("Error during login:", error);
            setError(error.response.data.message);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            {error && <p className='error-message'>{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>
                Not registered? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
}

export default Login;
