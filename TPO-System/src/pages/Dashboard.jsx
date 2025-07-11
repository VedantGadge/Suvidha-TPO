import { useState, useEffect } from 'react';
import './Dashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    email: '',
    contact: ''
  });
  const [entries, setEntries] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false); // Custom confirm modal state
  const [pendingSubmit, setPendingSubmit] = useState(false); // Track if submit is waiting for confirm
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/students/get')
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(item => ({
          name: item.name,
          college: item.college,
          email: item.email,
          contact_no: item.contact || item.contact_no
        }));
        setEntries(mapped);
      })
      .catch(() => setEntries([]));
  }, []);

  useEffect(() => {
    if (location.state?.showLoginToast) {
      toast.success('Logged in successfully!');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => {
    setDrawerOpen(false);
    setFormData({ name: '', college: '', email: '', contact: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPendingSubmit(true);
    setShowConfirm(true);
  };

  // Called when user confirms in custom modal
  const confirmAddTPO = async () => {
    setShowConfirm(false);
    setPendingSubmit(false);
    toast.warning('Adding TPO...');
    try {
      const response = await fetch('http://localhost:5000/api/students/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          college: formData.college,
          email: formData.email,
          contact_no: formData.contact
        })
      });
      if (response.ok) {
        const newTPO = { ...formData };
        setEntries([...entries, newTPO]);
        toast.success('TPO added successfully!');
        closeDrawer();
      } else {
        toast.error('Failed to add TPO!');
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error('Server error!');
    }
  };

  // Called when user cancels in custom modal
  const cancelAddTPO = () => {
    setShowConfirm(false);
    setPendingSubmit(false);
  };

  const handleLogout = () => {
    navigate('/login', { state: { showLogoutToast: true } });
  };

  // Filtered entries based on search query
  const filteredEntries = entries.filter(entry => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      entry.name.toLowerCase().includes(lowerCaseQuery) ||
      entry.college.toLowerCase().includes(lowerCaseQuery) ||
      entry.email.toLowerCase().includes(lowerCaseQuery) ||
      (entry.contact && entry.contact.toString().includes(lowerCaseQuery))
    );
  });

  return (
    <div className="dashboard-container">
      <div className="header-wrapper">
        <header className="dashboard-header">
          <div className="header-left">
            <div className="logo">
              <img src="SuvidhaLogo.png" alt="Suvidha Foundation Logo" className="logo-img" />
            </div>
            <div className="portal-info">
              <h2>TPO MANAGEMENT PORTAL</h2>
              <p>Training & Placement Officer Portal</p>
            </div>
          </div>
          <div className="header-right">
            <span className="welcome-msg">Welcome, saniya.b@somaiya.edu</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>
      </div>

      <main className="dashboard-main">
        <h1>Dashboard</h1>
        <p className="subtitle">Manage Training & Placement Officer details</p>

        <div className="stats-cards">
          <div className="stat-card">
            <p>Total TPOs</p>
            <h2>{entries.length}</h2>
          </div>
          <div className="stat-card">
            <p>Active Colleges</p>
            <h2>{entries.length}</h2>
          </div>
          <div className="stat-card">
            <p>Active TPOs</p>
            <h2 className="highlight">{entries.length}</h2>
          </div>
        </div>

        <section className="tpo-section">
          <div className="section-header">
            <div>
              <h2>TPO Details</h2>
              <p>Manage Training & Placement Officer information</p>
            </div>
            <button className="add-btn" onClick={openDrawer}>➕ Add Details</button>
          </div>

          <div className="tpo-table-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, college, contact no. or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="tpo-table-wrapper">
              <table className="tpo-table">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Name of Person</th>
                    <th>Name of College</th>
                    <th>Email ID</th>
                    <th>Contact No.</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{entry.name}</td>
                      <td>{entry.college}</td>
                      <td><a href={`mailto:${entry.email}`}>{entry.email}</a></td>
                      <td>{entry.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Modal for Add TPO */}
      {drawerOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add TPO</h2>
              <button onClick={closeDrawer} className="close-btn">✕</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <input type="text" id="name" placeholder="Name of Person" required value={formData.name} onChange={handleChange} />
              <input type="text" id="college" placeholder="Name of College" required value={formData.college} onChange={handleChange} />
              <input type="email" id="email" placeholder="Email ID" required value={formData.email} onChange={handleChange} />
              <input type="text" id="contact" placeholder="Contact No." required maxLength="10" value={formData.contact} onChange={handleChange} />
              <button type="submit" className="submit-btn" disabled={pendingSubmit}>Add</button>
              <button type="button" className="cancel-btn" onClick={closeDrawer}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h3>Confirm Add TPO</h3>
            <p>Are you sure you want to add this TPO?</p>
            <div className="modal-actions">
              <button className="submit-btn" onClick={confirmAddTPO}>Confirm</button>
              <button className="cancel-btn" onClick={cancelAddTPO}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Dashboard;

// { name: "Saniya B", college: "Somaiya College", email: "saniya.b@somaiya.edu", contact: "9876543210" },
//     { name: "Vedant Gadge", college: "MIT Pune", email: "vedant.gadge@mit.edu", contact: "9123456789" },
//     { name: "Priya Sharma", college: "IIT Bombay", email: "priya.sharma@iitb.ac.in", contact: "9988776655" },
//     { name: "Rahul Mehta", college: "NIT Trichy", email: "rahul.mehta@nitt.edu", contact: "9001122334" },
//     { name: "Ayesha Khan", college: "BITS Pilani", email: "ayesha.khan@bits-pilani.ac.in", contact: "9090909090" },
//     { name: "Rohan Patel", college: "VJTI Mumbai", email: "rohan.patel@vjti.ac.in", contact: "8888777766" },
//     { name: "Sneha Desai", college: "COEP Pune", email: "sneha.desai@coep.ac.in", contact: "7777888899" },
//     { name: "Amit Singh", college: "IIT Delhi", email: "amit.singh@iitd.ac.in", contact: "6666555544" },
//     { name: "Neha Gupta", college: "SRM University", email: "neha.gupta@srmist.edu.in", contact: "5555666677" },
//     { name: "Karan Joshi", college: "PES University", email: "karan.joshi@pes.edu", contact: "4444333322" },
//     { name: "Divya Nair", college: "Anna University", email: "divya.nair@annauniv.edu", contact: "3333222211" },
//     { name: "Arjun Rao", college: "JNTU Hyderabad", email: "arjun.rao@jntuh.ac.in", contact: "2222111100" },
//     { name: "Meera Iyer", college: "Manipal University", email: "meera.iyer@manipal.edu", contact: "1111000099" }
