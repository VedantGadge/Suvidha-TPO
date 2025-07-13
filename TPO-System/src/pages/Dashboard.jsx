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
  const [currentUser, setCurrentUser] = useState(null); // Store current user data
  const [isEditMode, setIsEditMode] = useState(false); // Track if editing
  const [editId, setEditId] = useState(null); // Store id being edited
  const [showEditConfirm, setShowEditConfirm] = useState(false); // Edit confirm modal
  const [pendingEdit, setPendingEdit] = useState(false); // Track if edit is waiting for confirm
  const [entries, setEntries] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false); // Custom confirm modal state (add)
  const [pendingSubmit, setPendingSubmit] = useState(false); // Track if submit is waiting for confirm (add)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Custom confirm modal state (delete)
  const [deleteId, setDeleteId] = useState(null); // Store id to delete
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [showEditProfile, setShowEditProfile] = useState(false); // Edit profile modal
  const [newName, setNewName] = useState(''); // New name for profile update
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch current user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          // Token might be expired, redirect to login
          navigate('/login');
          throw new Error('Unauthorized');
        }
      })
      .then(data => {
        setCurrentUser(data.user);
      })
      .catch(err => {
        console.error('Failed to fetch user data:', err);
        
        // Handle specific error types with user-friendly messages
        if (err.message.includes('429')) {
          toast.error('🔒 Too many requests! Please wait before refreshing.', {
            autoClose: 6000
          });
        } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          toast.error('🚫 Your session has expired. Please log in again.', {
            autoClose: 4000
          });
        } else {
          toast.error('❌ Failed to load user data. Please refresh the page.', {
            autoClose: 5000
          });
        }
        
        // If token is invalid, redirect to login
        localStorage.removeItem('token');
        navigate('/login');
      });
    } else {
      // No token, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/TPO/get', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 403) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          navigate('/login');
          throw new Error('Token expired or invalid');
        }
        return res.json();
      })
      .then(data => {
        if (data.message && data.message.includes('token')) {
          // Handle token-related errors
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        if (Array.isArray(data)) {
          const mapped = data.map(item => ({
            id: item.id, // include id from backend
            name: item.name,
            college: item.college,
            email: item.email,
            contact_no: item.contact_no || item.contact
          }));
          setEntries(mapped);
        } else {
          console.error('Unexpected API response format:', data);
          setEntries([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch TPO data:', err);
        
        // Enhanced error handling with user feedback
        if (err.message.includes('429')) {
          toast.error('🔒 Rate limit exceeded! Please wait before making more requests.', {
            autoClose: 6000
          });
        } else if (err.message.includes('413')) {
          toast.error('📁 Request too large! Please reduce data size.', {
            autoClose: 5000
          });
        } else if (err.message.includes('401')) {
          toast.error('🚫 Session expired! Redirecting to login...', {
            autoClose: 3000
          });
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.message.includes('Failed to fetch')) {
          toast.error('🌐 Network error! Check your connection.', {
            autoClose: 5000
          });
        } else {
          toast.error('❌ Failed to load data. Please try refreshing.', {
            autoClose: 5000
          });
        }
        
        setEntries([]);
      });
  }, [navigate]);

  useEffect(() => {
    if (location.state?.showLoginToast) {
      toast.success('Logged in successfully!');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const openDrawer = () => {
    setIsEditMode(false);
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setFormData({ name: '', college: '', email: '', contact: '' });
    setIsEditMode(false);
    setEditId(null);
    setPendingEdit(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setPendingEdit(true);
      setShowEditConfirm(true);
    } else {
      setPendingSubmit(true);
      setShowConfirm(true);
    }
  };
  // Edit button logic: open drawer with pre-filled data
  const handleEditTPO = (entry) => {
    setFormData({
      name: entry.name,
      college: entry.college,
      email: entry.email,
      contact: entry.contact_no || entry.contact || ''
    });
    setEditId(entry.id);
    setIsEditMode(true);
    setDrawerOpen(true);
  };

  // Called when user confirms in edit modal
  const confirmEditTPO = async () => {
    setShowEditConfirm(false);
    setPendingEdit(false);
    // Removed toast for 'Updating TPO...'
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/TPO/update/${editId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          college: formData.college,
          email: formData.email,
          contact_no: formData.contact
        })
      });
      if (response.ok) {
        setEntries(entries.map(e => e.id === editId ? { ...e, ...formData, contact_no: formData.contact } : e));
        toast.success('TPO updated successfully!');
        closeDrawer();
      } else {
        toast.error('Failed to update TPO!');
      }
    } catch (err) {
      toast.error('Server error!' + err.message);
    }
  };

  // Called when user cancels in edit modal
  const cancelEditTPO = () => {
    setShowEditConfirm(false);
    setPendingEdit(false);
  };

  // Called when user confirms in custom modal
  const confirmAddTPO = async () => {
    setShowConfirm(false);
    setPendingSubmit(false);
    toast.warning('Adding TPO...');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/TPO/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          college: formData.college,
          email: formData.email,
          contact_no: formData.contact
        })
      });
      if (response.ok) {
        // Get the id from the backend response
        const result = await response.json();
        const newTPO = { ...formData, id: result.id, contact_no: formData.contact };
        setEntries([...entries, newTPO]);
        toast.success('TPO added successfully!');
        closeDrawer();
      } else {
        toast.error('Failed to add TPO!');
      }
    } catch (err) {
      toast.error('Server error!' + err.message);
    }
  };

  // Delete TPO logic with custom modal
  const handleDeleteTPO = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTPO = async () => {
    setShowDeleteConfirm(false);
    if (!deleteId) return;
    // Removed toast for 'Deleting TPO...'
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/TPO/delete/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setEntries(entries.filter(e => e.id !== deleteId));
        toast.success('TPO deleted successfully!');
      } else {
        toast.error('Failed to delete TPO!');
      }
    } catch (err) {
      toast.error('Server error!' + err.message);
    }
    setDeleteId(null);
  };

  const cancelDeleteTPO = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  // Called when user cancels in custom modal
  const cancelAddTPO = () => {
    setShowConfirm(false);
    setPendingSubmit(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the JWT token
    navigate('/login', { state: { showLogoutToast: true } });
  };

  // Edit profile functions
  const handleEditProfile = () => {
    setNewName(currentUser?.name || currentUser?.username || '');
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!newName.trim()) {
      toast.error('Name cannot be empty!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser({ ...currentUser, name: data.user.name });
        setShowEditProfile(false);
        toast.success('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update profile!');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('Failed to update profile!');
    }
  };

  const handleCancelEditProfile = () => {
    setShowEditProfile(false);
    setNewName('');
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
            <div className="welcome-msg">
              <div className="user-profile">
                {currentUser && (
                  <div className="user-avatar">
                    {(currentUser.name || currentUser.username).charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="user-info">
                  <span>Welcome{currentUser ? `, ${currentUser.name || currentUser.username}` : ''}</span>
                  {currentUser && (
                    <button 
                      className="edit-profile-btn" 
                      onClick={handleEditProfile}
                      title="Edit Profile"
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
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
                    <th>Name</th>
                    <th>College</th>
                    <th>Email ID</th>
                    <th>Contact No.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <tr key={entry.id || index}>
                      <td>{index + 1}</td>
                      <td>{entry.name}</td>
                      <td>{entry.college}</td>
                      <td><a href={`mailto:${entry.email}`}>{entry.email}</a></td>
                      <td>{entry.contact_no || entry.contact}</td>
                      <td>
                        <button className="icon-btn edit-btn" title="Edit" onClick={() => handleEditTPO(entry)}>
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.7 2.29a1 1 0 0 1 1.42 0l1.59 1.59a1 1 0 0 1 0 1.42l-9.3 9.3-2.12.71.71-2.12 9.3-9.3z" stroke="#1976d2" strokeWidth="1.5" fill="none"/>
                            <path d="M3 17h14" stroke="#1976d2" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                        <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDeleteTPO(entry.id)}>
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="7" width="10" height="8" rx="1" stroke="#d32f2f" strokeWidth="1.5" fill="none"/>
                            <path d="M8 9v4M12 9v4" stroke="#d32f2f" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M3 7h14" stroke="#d32f2f" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M8 7V5a2 2 0 0 1 4 0v2" stroke="#d32f2f" strokeWidth="1.5"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Modal for Add/Edit TPO */}
      {drawerOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{isEditMode ? 'Edit TPO' : 'Add TPO'}</h2>
              <button onClick={closeDrawer} className="close-btn">✕</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <input type="text" id="name" placeholder="Name" required value={formData.name} onChange={handleChange} />
              <input type="text" id="college" placeholder="College" required value={formData.college} onChange={handleChange} />
              <input type="email" id="email" placeholder="Email ID" required value={formData.email} onChange={handleChange} />
              <input type="text" id="contact" placeholder="Contact No." required maxLength="10" value={formData.contact} onChange={handleChange} />
              <button type="submit" className="submit-btn" disabled={isEditMode ? pendingEdit : pendingSubmit}>{isEditMode ? 'Update' : 'Add'}</button>
              <button type="button" className="cancel-btn" onClick={closeDrawer}>Cancel</button>
            </form>
          </div>
        </div>
      )}
      {/* Custom Confirmation Modal for Edit */}
      {showEditConfirm && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h3>Confirm Edit</h3>
            <p>Are you sure you want to update this TPO?</p>
            <div className="modal-actions">
              <button className="submit-btn" onClick={confirmEditTPO}>Update</button>
              <button className="cancel-btn" onClick={cancelEditTPO}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal for Add */}
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

      {/* Custom Confirmation Modal for Delete */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this TPO?</p>
            <div className="modal-actions">
              <button className="submit-btn" onClick={confirmDeleteTPO}>Delete</button>
              <button className="cancel-btn" onClick={cancelDeleteTPO}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Edit Profile */}
      {showEditProfile && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button onClick={handleCancelEditProfile} className="close-btn">✕</button>
            </div>
            <div className="modal-content">
              <label htmlFor="username" className="modal-label">Name</label>
              <input
                type="text"
                id="username"
                className="modal-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="modal-actions">
              <button className="submit-btn" onClick={handleSaveProfile}>Save</button>
              <button className="cancel-btn" onClick={handleCancelEditProfile}>Cancel</button>
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
