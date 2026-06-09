import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PostRequest = () => {
  const [formData, setFormData] = useState({ patientName: '', bloodGroupRequired: '', location: '', urgency: 'normal' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://bloodunite-backend.onrender.com/api/requests', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Request posted successfully!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("Failed to post request");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: '20px auto' }}>
      <h2>Post Blood Request</h2>
      <input type="text" placeholder="Patient Name" onChange={(e) => setFormData({...formData, patientName: e.target.value})} required />
      <select onChange={(e) => setFormData({...formData, bloodGroupRequired: e.target.value})} required>
        <option value="">Select Blood Group</option>
        <option value="O+">O+</option>
        <option value="A+">A+</option>
      </select>
      <input type="text" placeholder="Location" onChange={(e) => setFormData({...formData, location: e.target.value})} required />
      <button type="submit">Submit Request</button>
    </form>
  );
};
export default PostRequest;