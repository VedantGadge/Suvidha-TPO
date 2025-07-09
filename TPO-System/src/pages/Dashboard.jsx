import { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    college: '',
    email: '',
    contact: ''
  });
  const [entries, setEntries] = useState([]);

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
    setEntries([...entries, formData]);
    closeDrawer();
  };

  const handleLogout = () => {
    alert("You have been logged out.");
    window.location.href = "login.html";
  };

  return (
    <div className="dashboard-container">
      <div className="header-wrapper">
        <header className="dashboard-header">
          <div className="header-left">
            <div className="logo">
              <img src="suvidha-logo1.jpeg" alt="Suvidha Foundation Logo" className="logo-img" />
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
            <input type="text" className="search-input" placeholder="Search by name, college, or email..." />
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
                  {entries.map((entry, index) => (
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

      <div className={`drawer ${drawerOpen ? 'open' : ''}`} id="drawer">
        <div className="drawer-header">
          <h2>Add TPO</h2>
          <button onClick={closeDrawer}>✕</button>
        </div>
        <form className="drawer-form" onSubmit={handleSubmit}>
          <input type="text" id="name" placeholder="Name of Person" required value={formData.name} onChange={handleChange} />
          <input type="text" id="college" placeholder="Name of College" required value={formData.college} onChange={handleChange} />
          <input type="email" id="email" placeholder="Email ID" required value={formData.email} onChange={handleChange} />
          <input type="text" id="contact" placeholder="Contact No." required maxLength="10" value={formData.contact} onChange={handleChange} />
          <button type="submit" className="submit-btn">Add</button>
          <button type="button" className="cancel-btn" onClick={closeDrawer}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
