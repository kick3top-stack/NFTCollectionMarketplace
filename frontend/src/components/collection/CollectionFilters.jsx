export default function CollectionFilters({ filters, onChange }) {
  const handleInputChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="collection-filters">
      <input
        type="text"
        name="search"
        placeholder="Search collections..."
        value={filters.search}
        onChange={handleInputChange}
      />
    </div>
  );
}
