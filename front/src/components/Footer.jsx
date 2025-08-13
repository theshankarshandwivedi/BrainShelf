import React from 'react'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>BrainShelf</h4>
            <p>Discover and share amazing projects</p>
          </div>
          <div className="footer-section">
            <h4>Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/upload">Upload Project</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Get in touch with us</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 BrainShelf. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;