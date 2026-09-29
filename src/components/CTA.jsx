export default function CTA({ onClick }) {
  return (
    <div className="cta"><div className="w">
      <h2>Your next signature scent<br />is waiting.</h2>
      <p>Explore our curated fragrance picks and discover something you'll want to wear again and again.</p>
      <button className="b" onClick={onClick}>Explore the Collection →</button>
    </div></div>
  );
}
