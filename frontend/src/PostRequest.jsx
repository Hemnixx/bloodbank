import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PostRequest = () => {
  const [formData, setFormData] = useState({ 
    patientName: '', 
    bloodGroupRequired: '', 
    location: '', 
    urgency: 'normal' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://bloodunite-backend.onrender.com/api/requests', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Request posted successfully!");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post request");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#dc3545', marginBottom: '20px' }}>Post Blood Request</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input style={inputStyle} type="text" placeholder="Patient Name" onChange={(e) => setFormData({...formData, patientName: e.target.value})} required />
        
        <select style={inputStyle} onChange={(e) => setFormData({...formData, bloodGroupRequired: e.target.value})} required>
          <option value="">Select Blood Group</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
        </select>

        <input style={inputStyle} type="text" placeholder="Hospital Location" onChange={(e) => setFormData({...formData, location: e.target.value})} required />
        
        <select style={inputStyle} onChange={(e) => setFormData({...formData, urgency: e.target.value})}>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="critical">Critical</option>
        </select>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>
          {loading ? 'Posting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};
export default PostRequest;