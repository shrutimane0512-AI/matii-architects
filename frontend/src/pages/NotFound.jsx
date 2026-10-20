import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <h1>Page not found</h1>
        <p style={{ margin: '16px 0 28px' }}>The page you are looking for doesn't exist.</p>
        <Link to="/" className="btn">
          Back to home
        </Link>
      </div>
    </section>
  );
}
