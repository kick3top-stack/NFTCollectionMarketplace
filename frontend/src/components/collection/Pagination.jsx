export default function Pagination({ currentPage = 1, totalPages = 5 }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      {pages.map((p) => (
        <button
          key={p}
          className={`page-btn ${p === currentPage ? "active" : ""}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
