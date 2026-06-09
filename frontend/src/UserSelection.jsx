import { useNavigate } from 'react-router-dom';

const UserSelection = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <h1>Aap aaj kya karna chahte hain?</h1>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '40px' }}>
        {/* Donate Button */}
        <button 
          onClick={() => navigate('/requests')} 
          style={{ padding: '20px 40px', fontSize: '1.2rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
        >
          Donate Blood
        </button>
        {/* Request Button */}
        <button 
          onClick={() => navigate('/post-request')} 
          style={{ padding: '20px 40px', fontSize: '1.2rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
        >
          Request Blood
        </button>
      </div>
    </div>
  );
};
export default UserSelection;