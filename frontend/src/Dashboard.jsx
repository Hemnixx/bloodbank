import { useSelector } from 'react-redux';
import DonorDashboard from './DonorDashboard';
import PatientDashboard from './PatientDashboard';

const Dashboard = () => {
  // 1. Grab the user object from Redux
  const { user } = useSelector((state) => state.auth);

  // 2. Add a safety check: if no user is found, tell them to log in
  if (!user) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Please log in to view your dashboard.</div>;
  }

  // 3. Render based on the role property
  return (
    <div>
      {user.role === 'donor' ? <DonorDashboard /> : <PatientDashboard />}
    </div>
  );
};

export default Dashboard;