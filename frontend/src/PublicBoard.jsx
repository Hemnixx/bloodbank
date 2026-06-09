const PublicBoard = () => {
  return (
    <div className="landing-page" style={{ fontFamily: 'Arial, sans-serif' }}>
      <section className="hero" style={{ padding: '60px 20px', textAlign: 'center', background: '#f8d7da', borderRadius: '20px', margin: '20px' }}>
        <h1 style={{ fontSize: '3rem', color: '#dc3545' }}>BloodUnite</h1>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>Bridging the gap between donors and patients in times of need.</p>
        <button style={{ padding: '15px 30px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', marginTop: '20px' }}>Join the Movement</button>
      </section>

      <section className="info" style={{ padding: '40px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <div style={{ width: '300px', textAlign: 'center' }}>
          <h3>Safety First</h3>
          <p>We ensure all donor data is verified and protected.</p>
        </div>
        <div style={{ width: '300px', textAlign: 'center' }}>
          <h3>Instant Alerts</h3>
          <p>Get notified when a match is found in your area.</p>
        </div>
      </section>
    </div>
  );
};
export default PublicBoard;