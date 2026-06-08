import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaTint } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bloodGroup: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.bloodGroup) {
      return toast.error("Please fill in all fields");
    }

    try {
      // NOTE: Replace this URL with your actual backend register endpoint if different
      const response = await fetch('https://bloodunite-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! Please log in.");
        navigate('/login');
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '400px', margin: '50px auto', padding: '30px' }}>
      <h2 style={{ color: 'var(--primary-red)', textAlign: 'center', marginBottom: '20px' }}>
        Join BloodUnite
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <FaUser style={{ marginRight: '10px', color: '#666' }} />
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={formData.name}
            onChange={handleChange}
            style={{ width: '85%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <FaEnvelope style={{ marginRight: '10px', color: '#666' }} />
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleChange}
            style={{ width: '85%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <FaTint style={{ marginRight: '10px', color: 'var(--primary-red)' }} />
          <select 
            name="bloodGroup" 
            value={formData.bloodGroup}
            onChange={handleChange}
            style={{ width: '85%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <FaLock style={{ marginRight: '10px', color: '#666' }} />
          <input 
            type="password" 
            name="password" 
            placeholder="Create Password" 
            value={formData.password}
            onChange={handleChange}
            style={{ width: '85%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ width: '100%', padding: '12px', backgroundColor: 'var(--primary-red)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Create Account
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
        Already a hero? <Link to="/login" style={{ color: 'var(--primary-red)' }}>Log in here</Link>.
      </p>
    </div>
  );
};

export default Register;