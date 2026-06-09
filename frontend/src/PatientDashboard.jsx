import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Patient Support Portal</h1>
      {/* Add the onClick here to navigate to the new form page */}
      <button onClick={() => navigate('/post-request')} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white' }}>
        + Post New Request
      </button>
    </div>
  );
};