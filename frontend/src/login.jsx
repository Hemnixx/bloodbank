import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './authSlice';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('https://bloodunite-backend.onrender.com/api/login', {
                email: email,
                password: password
            });

            // 1. Token save karein
            localStorage.setItem('token', response.data.token);
            
            // 2. Redux mein dispatch karein
            dispatch(loginSuccess({ 
                token: response.data.token, 
                user: response.data.user 
            }));
            
            // 3. Success hone par hi redirect karein
            alert('Login Successful!');
            navigate('/selection'); 
            
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ color: '#dc3545', textAlign: 'center' }}>Donor Login</h2>
                
                {error && (
                    <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} 
                        required 
                    />
                    <button 
                        type="submit" 
                        style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Login
                    </button>
                </form>
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
                Don't have an account? <Link to="/register" style={{ color: '#dc3545' }}>Register here</Link>.
            </p>
        </div>
    );
}