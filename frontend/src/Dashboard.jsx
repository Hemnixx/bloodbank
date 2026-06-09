import { useSelector } from 'react-redux';
import DonorDashboard from './DonorDashboard';
import PatientDashboard from './PatientDashboard';

const Dashboard = () => {
  // This line hooks into Redux to check who is logged in
  const role = useSelector((state) => state.auth.user?.role);

  // This is the "Traffic Controller" logic
  return (
    <div className="dashboard-container" style={{ padding: '20px' }}>
      {role === 'donor' ? <DonorDashboard /> : <PatientDashboard />}
    </div>
  );
};

export default Dashboard;