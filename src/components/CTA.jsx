export default function CTA({ onClick }) {
  return (
    <div className="cta"><div className="w">
      <h2>Your next signature watch<br />is waiting.</h2>
      <p>Explore our curated luxury watch picks and discover a timepiece you'll want to wear for years.</p>
      <button className="b" onClick={onClick}>Explore the Collection →</button>
    </div></div>
  );
}
