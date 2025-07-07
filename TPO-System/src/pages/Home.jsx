import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="nav-logo">🎓</div>
          <span className="nav-title">Suvidha Foundation</span>
        </div>
        
        <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#home" className="nav-link">Home</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#programs" className="nav-link">Programs</a>
          <a href="#contact" className="nav-link">Contact</a>
          <Link to="/login" className="nav-link nav-login">Login</Link>
        </div>

        <div className="nav-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Empowering Communities Through 
            <span className="hero-highlight"> Education</span>
          </h1>
          <p className="hero-description">
            Join the Suvidha Foundation in our mission to bridge educational gaps 
            and create opportunities for financially challenged communities since 1995.
          </p>
          <div className="hero-buttons">
            <button className="hero-btn primary">Learn More</button>
            <Link to="/login" className="hero-btn secondary">TPO Portal</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">
            <div className="hero-icon">📚</div>
            <p>Education for All</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  return (
    <section className="stats-section">
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-number">28+</div>
          <div className="stat-label">Years of Service</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">10,000+</div>
          <div className="stat-label">Lives Impacted</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">Programs Conducted</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Partner Institutions</div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="about" className="features-section">
      <div className="features-container">
        <h2 className="features-title">Our Impact Areas</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Education</h3>
            <p>Providing quality education access and scholarships to underprivileged students.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Skill Development</h3>
            <p>Training programs for employment and entrepreneurship opportunities.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Environment</h3>
            <p>Tree plantation drives and environmental awareness campaigns.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👩‍⚕️</div>
            <h3>Healthcare</h3>
            <p>Medical camps and health awareness programs for rural communities.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Programs = () => {
  return (
    <section id="programs" className="programs-section">
      <div className="programs-container">
        <h2 className="programs-title">Our Programs</h2>
        <div className="programs-grid">
          <div className="program-card">
            <div className="program-image">🎒</div>
            <h3>Education Support</h3>
            <p>Free books, uniforms, and school supplies for underprivileged children.</p>
            <ul>
              <li>📖 Free textbooks and study materials</li>
              <li>👕 School uniforms and supplies</li>
              <li>🏫 Infrastructure development</li>
            </ul>
          </div>
          <div className="program-card">
            <div className="program-image">💻</div>
            <h3>Digital Literacy</h3>
            <p>Computer training and digital skills for the modern workforce.</p>
            <ul>
              <li>💻 Basic computer training</li>
              <li>🌐 Internet and digital safety</li>
              <li>📱 Mobile technology education</li>
            </ul>
          </div>
          <div className="program-card">
            <div className="program-image">🌳</div>
            <h3>Environmental Awareness</h3>
            <p>Tree plantation drives and environmental conservation programs.</p>
            <ul>
              <li>🌱 Tree plantation campaigns</li>
              <li>♻️ Waste management education</li>
              <li>🌍 Climate change awareness</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>Ready to make a difference? Contact us to learn more about our programs or how you can contribute.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Address</h4>
                  <p>Mumbai, Maharashtra, India</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>info@suvidha.org</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="contact-form">
            <h3>Send us a message</h3>
            <form>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <input type="text" placeholder="Subject" required />
              <textarea placeholder="Your Message" rows="5" required></textarea>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Suvidha Foundation</h3>
            <p>Empowering communities through education since 1995.</p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">💼</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#programs">Programs</a></li>
              <li><a href="#volunteer">Volunteer</a></li>
              <li><a href="#donate">Donate</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Programs</h4>
            <ul>
              <li><a href="#education">Education</a></li>
              <li><a href="#healthcare">Healthcare</a></li>
              <li><a href="#environment">Environment</a></li>
              <li><a href="#women">Women Empowerment</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📍 Mumbai, Maharashtra, India</p>
            <p>📧 info@suvidha.org</p>
            <p>📞 +91 98765 43210</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Suvidha Foundation. All rights reserved.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Home = () => {
  return (
    <div className="home-page">
      <Navigation />
      <Hero />
      <Stats />
      <Features />
      <Programs />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
