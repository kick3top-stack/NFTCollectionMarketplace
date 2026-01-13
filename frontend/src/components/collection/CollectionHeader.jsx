export default function CollectionHeader({ title = "Newest Collections" }) {
  return (
    <div className="collection-header">
      <h2>{title}</h2>
    </div>
  );
}
