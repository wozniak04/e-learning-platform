import { useState } from "react";
import "./styles/courses.css";
import type { FetchCourseInfoParams } from "../../store/Storetypes";

interface CourseFilterProps {
  onApply: (filters: FetchCourseInfoParams) => void;
}
function CourseFilter({ onApply }: CourseFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [courseType, setCourseType] = useState("all");
  const [orderBy, setOrderBy] = useState("newest");

  return (
    <div id="CourseFilter">
      <div className="search-bar-container">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Wyszukaj kurs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <button
          className="search-button"
          onClick={() =>
            onApply({
              onlysaved: onlySaved,
              search: searchInput,
              type: courseType,
              sort: orderBy,
            })
          }>
          Szukaj
        </button>
      </div>

      <button
        className="toggle-filters-btn"
        onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "▲ Ukryj filtry" : "▼ Rozwiń filtry"}
      </button>

      {isExpanded && (
        <div className="filter-options-dropdown">
          <div className="filter-group">
            <label>Typ:</label>
            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}>
              <option value="all">Wszystkie</option>
              <option value="video">Wideo</option>
              <option value="tekst">Tekstowe</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sortuj:</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}>
              <option value="newest">Najnowsze</option>
              <option value="oldest">Najstarsze</option>
              <option value="alphabetical">A-Z (Alfabetycznie)</option>
            </select>
          </div>

          <div className="filter-group checkbox-group">
            <input
              type="checkbox"
              id="onlyMine"
              checked={onlySaved}
              onChange={(e) => setOnlySaved(e.target.checked)}
            />
            <label htmlFor="onlyMine">Tylko Zapisane kursy</label>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseFilter;
