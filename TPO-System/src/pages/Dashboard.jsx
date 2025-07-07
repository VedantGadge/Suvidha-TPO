import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <div className="nav-logo">🎓</div>
          <span className="nav-title">TPO Dashboard</span>
        </div>
        <Link to="/" className="logout-btn">Logout</Link>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome to TPO Management Portal</h1>
          <p>Manage your training and placement activities</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon">👥</div>
            <h3>Students</h3>
            <p>Manage student profiles and placements</p>
            <button className="card-btn">View Students</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🏢</div>
            <h3>Companies</h3>
            <p>Manage company partnerships</p>
            <button className="card-btn">View Companies</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Reports</h3>
            <p>View placement statistics and reports</p>
            <button className="card-btn">View Reports</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>Events</h3>
            <p>Schedule campus interviews and events</p>
            <button className="card-btn">View Events</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
