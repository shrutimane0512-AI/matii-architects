export default function Status({ loading, error }) {
  if (loading) return <p className="status">Loading…</p>;
  if (error)
    return (
      <p className="status status--error">
        Could not load content: {error.message}. Is the backend running on port 8000?
      </p>
    );
  return null;
}
