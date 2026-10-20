import { Link } from 'react-router-dom';
import logoImg from '../assets/hero/matii-logo.png';
import { NAV_SECTIONS } from './navSections.js';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src={logoImg} alt="" className="footer__mark" />
          <div>
            <Link to="/" className="footer__logo">
              MATIIARCHITECTS
            </Link>
            <p>Modern forms, rooted in tradition.</p>
          </div>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h4>Explore</h4>
          {NAV_SECTIONS.map(({ id, label }) => (
            <Link key={id} to={`/${id}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="footer__col">
          <h4>Studio</h4>
          <p>Pune, Maharashtra, India</p>
          <a href="mailto:hello@matiiarchitects.com">hello@matiiarchitects.com</a>
          <p>Mon – Sat, 10am – 6pm</p>
        </div>

        <div className="footer__col">
          <h4>Start a project</h4>
          <p>Have a site or an idea? We would love to hear about it.</p>
          <Link to="/contact" className="footer__cta">
            Get in touch →
          </Link>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} Matii Architects. All rights reserved.</p>
        <p>माती — architecture rooted in earth.</p>
      </div>
    </footer>
  );
}
