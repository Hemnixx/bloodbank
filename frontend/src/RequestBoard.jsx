import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // 1. Import for navigation
import { useSelector } from 'react-redux';       // 2. Import to check login state

const RequestBoard = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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

  // 3. Logic to handle the "Donate" button
  const handleDonate = (requestId) => {
    if (!isAuthenticated) {
      toast.warn("Please login or register to donate!");
      navigate('/login');
    } else {
      toast.info("Donation process initiated for request: " + requestId);
      // Here you would eventually trigger a PUT request to update the status
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
            {/* 4. Attach the handler to the button */}
            <button 
              onClick={() => handleDonate(req._id)}
              style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}
            >
              Donate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RequestBoard;