import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaTint, FaCheckCircle, FaExclamationCircle, FaTimes, FaPhone, FaClock, FaHeartbeat } from 'react-icons/fa';

export default function PublicBoard() {
    const [requests, setRequests] = useState([]);
    
    // --- Modal State Variables ---
    const [selectedEmergency, setSelectedEmergency] = useState(null);
    const [eta, setEta] = useState('30 mins');
    const [phone, setPhone] = useState('');
    const [healthConfirmed, setHealthConfirmed] = useState(false);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const navigate = useNavigate();

    // Fetch emergencies when the page loads
    useEffect(() => {
        fetchLiveRequests();
    }, []);

    const fetchLiveRequests = async () => {
        try {
            const response = await axios.get('https://bloodunite-backend.onrender.com/api/requests');
            // Filter out 'fulfilled' requests, but keep 'pending' and 'accepted'
            const activeRequests = response.data.data.filter(req => req.status !== 'fulfilled');
            setRequests(activeRequests);
        } catch (error) {
            toast.error("Failed to load live emergencies.");
        }
    };

    // 1. When a user clicks the initial "I Can Donate" button
    const initiateDonation = (id) => {
        if (!isAuthenticated) {
            toast.warning("Please log in to accept a blood request!");
            navigate('/login');
            return;
        }
        // Open the modal by setting the ID
        setSelectedEmergency(id);
    };

    // 2. When the user submits the Modal form
    const confirmDonation = async (e) => {
        e.preventDefault();

        if (!healthConfirmed) {
            toast.error("You must confirm you are healthy to donate.");
            return;
        }

        const token = localStorage.getItem('token');
        const toastId = toast.loading("Confirming your commitment...");

        try {
            // Update the backend status to 'accepted'
            await axios.put(`https://bloodunite-backend.onrender.com/api/requests/${selectedEmergency}`, 
                { status: 'accepted' }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.update(toastId, { render: "Thank you! The hospital has been notified.", type: "success", isLoading: false, autoClose: 5000 });
            
            // Instantly update the UI to show the gray banner instead of deleting the card
            setRequests(requests.map(req => 
                req._id === selectedEmergency ? { ...req, status: 'accepted' } : req
            ));
            
            closeModal();
            
        } catch (error) {
            toast.update(toastId, { render: "Failed to accept request.", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    // 3. Helper function to close and reset the modal
    const closeModal = () => {
        setSelectedEmergency(null);
        setPhone('');
        setEta('30 mins');
        setHealthConfirmed(false);
    };

    return (
        <div className="main-container">
            {/* --- The Main Live Board --- */}
            <div className="glass-card" style={{ position: 'relative' }}>
                <h2 style={{ color: 'var(--primary-red)', marginBottom: '20px', fontSize: '2rem', textAlign: 'center' }}>
                    <FaExclamationCircle /> Live Emergency Board
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '30px' }}>
                    Real-time blood requests. Step up and save a life today.
                </p>

                {requests.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <h3 style={{ color: '#00b894', fontSize: '1.5rem' }}>
                            <FaCheckCircle style={{ marginRight: '10px' }} /> 
                            No pending emergencies right now!
                        </h3>
                    </div>
                ) : (
                    requests.map((req, index) => (
                        <div key={req._id} className="emergency-card" style={{ animationDelay: `${index * 0.1}s`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>
                                    {req.patientName} <span style={{ color: 'var(--primary-red)', fontSize: '1.5rem', marginLeft: '10px' }}><FaTint /> {req.bloodGroupRequired}</span>
                                </h4>
                                <p style={{ margin: '5px 0', color: 'var(--text-light)', fontSize: '1.1rem' }}>
                                    <FaMapMarkerAlt color="var(--primary-red)" /> {req.location}
                                </p>
                                <p style={{ margin: '5px 0', color: '#e17055', fontWeight: 'bold' }}>
                                    Priority: {req.urgency ? req.urgency.toUpperCase() : 'CRITICAL'}
                                </p>
                            </div>
                            
                            {/* Conditional Button: Green if Pending, Gray Banner if Accepted */}
                            {req.status === 'pending' ? (
                                <button 
                                    onClick={() => initiateDonation(req._id)}
                                    className="btn-primary" 
                                    style={{ width: 'auto', padding: '12px 25px', background: 'linear-gradient(135deg, #00b894, #55efc4)', boxShadow: '0 4px 15px rgba(0, 184, 148, 0.4)' }}
                                >
                                    <FaCheckCircle style={{ marginRight: '8px' }} /> I Can Donate
                                </button>
                            ) : (
                                <div style={{ background: '#f1f2f6', padding: '10px 20px', borderRadius: '8px', color: '#747d8c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #dfe4ea' }}>
                                    <FaClock /> Hero On The Way
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* --- The Popup Donor Commitment Modal --- */}
            {selectedEmergency && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="glass-card" style={{ width: '90%', maxWidth: '500px', background: 'white', padding: '30px', position: 'relative', animation: 'slideUp 0.3s ease' }}>
                        
                        {/* Close Button */}
                        <button onClick={closeModal} style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', color: '#b2bec3', cursor: 'pointer' }}>
                            <FaTimes />
                        </button>

                        <h3 style={{ color: 'var(--primary-red)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FaHeartbeat /> Donor Commitment Form
                        </h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '20px', fontSize: '0.95rem' }}>
                            Please confirm your details. A patient is relying on you.
                        </p>

                        <form onSubmit={confirmDonation} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            
                            <div style={{ position: 'relative' }}>
                                <FaPhone style={{ position: 'absolute', top: '15px', left: '15px', color: '#a4b0be' }} />
                                <input className="form-input" style={{ paddingLeft: '45px', margin: 0 }} type="tel" placeholder="Your Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <FaClock style={{ position: 'absolute', top: '15px', left: '15px', color: '#a4b0be' }} />
                                <select className="form-input" style={{ paddingLeft: '45px', margin: 0 }} value={eta} onChange={e => setEta(e.target.value)}>
                                    <option value="15 mins">I can be there in 15 mins</option>
                                    <option value="30 mins">I can be there in 30 mins</option>
                                    <option value="1 hour">I can be there in 1 hour</option>
                                    <option value="2 hours+">I can be there in 2+ hours</option>
                                </select>
                            </div>

                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #dfe6e9', cursor: 'pointer' }}>
                                <input type="checkbox" checked={healthConfirmed} onChange={e => setHealthConfirmed(e.target.checked)} style={{ marginTop: '5px', transform: 'scale(1.2)' }} />
                                <span style={{ fontSize: '0.9rem', color: '#2d3436' }}>
                                    I confirm I am in good health, weigh over 50kg, and have not consumed alcohol in the last 24 hours.
                                </span>
                            </label>

                            <button className="btn-primary" type="submit" style={{ marginTop: '10px', background: 'linear-gradient(135deg, #00b894, #55efc4)' }}>
                                Confirm & Accept Emergency
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}