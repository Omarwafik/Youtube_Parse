// src/Pagination.js
import React from "react";

export default function Pagination({ onPrev, onNext, showPrev, showNext }) {
  return (
    <div className="pagination">
      <button onClick={onPrev} disabled={!showPrev} className="btn">Prev</button>
      <button onClick={onNext} disabled={!showNext} className="btn">Next</button>
    </div>
  );
}
