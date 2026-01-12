import { useState, useMemo, useEffect } from "react";
import CollectionCard from "./CollectionCard";
import "../../styles/CollectionGrid.css";

export default function CollectionsGrid({ collections }) {
  const ITEMS_PER_PAGE = 8;
  const MAX_PAGE_BUTTONS = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnimating, setIsAnimating] = useState(false); // <-- new

  const filteredCollections = useMemo(() => {
    if (!searchTerm) return collections;
    return collections.filter((col) =>
      col.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections, searchTerm]);

  const totalPages = Math.ceil(filteredCollections.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsAnimating(true);      // start animation
      setTimeout(() => {
        setCurrentPage(page);
        setIsAnimating(false);   // reset animation
      }, 300); // match CSS transition duration
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCollections = filteredCollections.slice(startIndex, endIndex);

  const placeholders = Array.from(
    { length: Math.max(0, ITEMS_PER_PAGE - currentCollections.length) },
    (_, i) => i
  );

  const getVisiblePages = () => {
    let start = Math.max(1, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
    let end = start + MAX_PAGE_BUTTONS - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - MAX_PAGE_BUTTONS + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="collections-grid-wrapper">
      {/* Search Input */}
      <div className="collections-search">
        <input
          type="text"
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Grid with animation */}
      <div className={`collections-grid page-background ${isAnimating ? "fade-out" : "fade-in"}`}>
        {currentCollections.map((col, idx) => (
          <CollectionCard
            key={idx}
            name={col.name}
            owner={col.owner}
            items={col.items}
            image={col.image}
          />
        ))}
        {placeholders.map((_, idx) => (
          <div key={idx} className="placeholder-card" />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
            &lt;&lt;
          </button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
          </button>
          {getVisiblePages().map((page) => (
            <button
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            &gt;
          </button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
}
