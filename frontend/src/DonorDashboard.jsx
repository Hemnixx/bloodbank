const DonorDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#dc3545' }}>Donor Command Center</h2>
      <p>View active blood requests and save lives today.</p>
      {/* We will add the list of requests here next! */}
      <div className="requests-list">
         <p>Loading available requests...</p>
      </div>
    </div>
  );
};

export default DonorDashboard;