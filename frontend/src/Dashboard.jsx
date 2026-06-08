import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaTint, FaHospital, FaExclamationTriangle, FaPaperPlane, FaCheckDouble, FaTrashAlt, FaClock } from 'react-icons/fa';

export default function Dashboard() {
    const [myRequests, setMyRequests] = useState([]);
    const [patientName, setPatientName] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [location, setLocation] = useState('');
    const [urgency, setUrgency] = useState('critical');
    
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchMyHistory(token);
    }, [navigate]);

    const fetchMyHistory = async (token) => {
        try {
            const response = await axios.get('https://bloodunite-backend.onrender.com/api/my-requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyRequests(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch your history.");
        }
    };

    // --- Create a new request ---
    const handleCreateRequest = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const toastId = toast.loading("Broadcasting to donors...");

        try {
            await axios.post('https://bloodunite-backend.onrender.com/api/requests', {
                patientName, bloodGroupRequired: bloodGroup, location, urgency
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.update(toastId, { render: "Emergency Broadcasted Successfully!", type: "success", isLoading: false, autoClose: 3000 });
            setPatientName(''); setBloodGroup(''); setLocation('');
            fetchMyHistory(token);
        } catch (error) {
            toast.update(toastId, { render: "Failed to post request. Check your format.", type: "error", isLoading: false, autoClose: 4000 });
        }
    };

    // --- NEW: Mark as Received (Close the loop) ---
    const handleMarkFulfilled = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`https://bloodunite-backend.onrender.com/api/requests/${id}`, 
                { status: 'fulfilled' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Wonderful news! Request marked as completed.");
            // Refresh the list to show the new status
            fetchMyHistory(token);
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    // --- NEW: Delete a Request ---
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this request?")) return;
        
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`https://bloodunite-backend.onrender.com/api/requests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Request permanently deleted.");
            // Remove it from the screen
            setMyRequests(myRequests.filter(req => req._id !== id));
        } catch (error) {
            toast.error("Failed to delete request.");
        }
    };

    return (
        <div className="main-container">
            <div className="glass-card">
               {/* Find this section and change the text inside: */}
<h2 style={{ color: 'var(--primary-red)', marginBottom: '30px', fontSize: '2rem' }}>
    Welcome to the Blood Donation Hub
</h2>
                
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaExclamationTriangle color="var(--primary-red)" /> Post a New Emergency
                </h3>

                <form onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <FaUser style={{ position: 'absolute', top: '18px', left: '15px', color: '#a4b0be' }} />
                        <input className="form-input" style={{ paddingLeft: '45px' }} type="text" placeholder="Patient Name" value={patientName} onChange={e => setPatientName(e.target.value)} required />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <FaTint style={{ position: 'absolute', top: '18px', left: '15px', color: '#a4b0be' }} />
                        <input className="form-input" style={{ paddingLeft: '45px' }} type="text" placeholder="Blood Group (MUST be exact, e.g. B+, A-)" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} required />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <FaHospital style={{ position: 'absolute', top: '18px', left: '15px', color: '#a4b0be' }} />
                        <input className="form-input" style={{ paddingLeft: '45px' }} type="text" placeholder="Hospital / Location" value={location} onChange={e => setLocation(e.target.value)} required />
                    </div>

                    <select className="form-input" value={urgency} onChange={e => setUrgency(e.target.value)}>
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent Priority</option>
                        <option value="critical">Critical (Need Immediately)</option>
                    </select>
                    
                    <button className="btn-primary" type="submit" style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        <FaPaperPlane /> Broadcast Request
                    </button>
                </form>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3 style={{ color: 'var(--text-dark)' }}>My Request History</h3>
                {myRequests.length === 0 ? <p style={{ color: 'var(--text-light)' }}>You have not posted any requests yet.</p> : (
                    myRequests.map((req, index) => (
                        <div key={req._id} className="emergency-card" style={{ animationDelay: `${index * 0.1}s`, borderLeftColor: req.status === 'fulfilled' ? '#00b894' : req.status === 'accepted' ? '#fdcb6e' : 'var(--primary-red)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{req.patientName} <span style={{ color: 'var(--primary-red)' }}>({req.bloodGroupRequired})</span></h4>
                                    <p style={{ margin: '5px 0', color: 'var(--text-light)' }}>Location: {req.location}</p>
                                    
                                    {/* Beautiful dynamic status text */}
                                    <p style={{ margin: '5px 0', fontSize: '1.1rem' }}>
                                        Status: 
                                        {req.status === 'pending' && <strong style={{ color: 'var(--primary-red)', marginLeft: '5px' }}>Waiting for Donors...</strong>}
                                        {req.status === 'accepted' && <strong style={{ color: '#fdcb6e', marginLeft: '5px' }}><FaClock /> A Hero is on the way!</strong>}
                                        {req.status === 'fulfilled' && <strong style={{ color: '#00b894', marginLeft: '5px' }}><FaCheckDouble /> Completed</strong>}
                                    </p>
                                </div>

                                {/* Dynamic Action Buttons based on status */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                                    
                                    {/* If a donor is on the way, the patient can mark it as successfully received */}
                                    {req.status === 'accepted' && (
                                        <button 
                                            onClick={() => handleMarkFulfilled(req._id)}
                                            style={{ padding: '10px 15px', background: '#00b894', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <FaCheckDouble /> Blood Received
                                        </button>
                                    )}

                                    {/* Only allow deleting if it hasn't been fulfilled yet */}
                                    {req.status !== 'fulfilled' && (
                                        <button 
                                            onClick={() => handleDelete(req._id)}
                                            style={{ padding: '8px 15px', background: 'transparent', color: '#d63031', border: '1px solid #d63031', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <FaTrashAlt /> Delete Request
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}