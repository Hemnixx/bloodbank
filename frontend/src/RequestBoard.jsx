import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequestBoard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Data fetch karne ke liye
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('https://bloodunite-backend.onrender.com/api/requests');
        setRequests(res.data.data);
      } catch (err) {
        toast.error("Could not load requests");
      }
    };
    fetchRequests();
  }, []);

  // DONATE button ka asli logic
  const handleDonate = async (requestId) => {
    // 1. Pehle check karein ki user logged in hai ya nahi
    if (!isAuthenticated) {
      toast.warn("Please login to donate!");
      navigate('/login');
      return;
    }

    // 2. Agar logged in hai, toh API call karein
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://bloodunite-backend.onrender.com/api/requests/${requestId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: 'accepted' })
      });

      if (response.ok) {
        toast.success("Request accepted! Thank you for donating.");
        // UI ko update karne ke liye local state refresh karein
        setRequests(requests.filter(req => req._id !== requestId));
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error connecting to server");
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ textAlign: 'center', color: '#dc3545' }}>Active Blood Requests</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {requests.map((req) => (
          <div key={req._id} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3>{req.patientName}</h3>
            <p><strong>Blood Group:</strong> {req.bloodGroupRequired}</p>
            <p><strong>Location:</strong> {req.location}</p>
            <p><strong>Urgency:</strong> {req.urgency}</p>
            <p><strong>Status:</strong> {req.status}</p>
            
            <button 
              onClick={() => handleDonate(req._id)}
              style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}
            >
              Donate Blood
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RequestBoard;