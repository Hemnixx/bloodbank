import { useNavigate } from 'react-router-dom';

const UserSelection = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>What would you like to do today?</h1>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
        <button 
          onClick={() => navigate('/requests')} 
          style={{ padding: '20px 40px', fontSize: '1.2rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
        >
          I want to Donate
        </button>
        <button 
          onClick={() => navigate('/post-request')} 
          style={{ padding: '20px 40px', fontSize: '1.2rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
        >
          I want to Request Blood
        </button>
      </div>
    </div>
  );
};
export default UserSelection;