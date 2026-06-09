const PatientDashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#dc3545' }}>Patient Support Portal</h2>
      <p>Need blood? Post a request to notify our network of donors.</p>
      {/* We will add the "Post Request" form here next! */}
      <button style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
        + Post New Request
      </button>
    </div>
  );
};

export default PatientDashboard;