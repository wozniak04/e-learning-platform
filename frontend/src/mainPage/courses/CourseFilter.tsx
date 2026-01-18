import { useState } from "react";
import "./styles/courses.css";
import type { FetchCourseInfoParams } from "../../store/Storetypes";
import { useTranslation } from "react-i18next";

interface CourseFilterProps {
  onApply: (filters: FetchCourseInfoParams) => void;
}

function CourseFilter({ onApply }: CourseFilterProps) {
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [onlySaved, setOnlySaved] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [courseType, setCourseType] = useState("all");
  const [orderBy, setOrderBy] = useState("alphabetical");

  return (
    <div id="CourseFilter">
      <div className="search-bar-container">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder={t("filters.placeholder")}
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
          {t("filters.search")}
        </button>
      </div>

      <button
        className="toggle-filters-btn"
        onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? t("filters.hide_filters") : t("filters.show_filters")}
      </button>

      {isExpanded && (
        <div className="filter-options-dropdown">
          <div className="filter-group">
            <label>{t("filters.type")}</label>
            <select
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}>
              <option value="all">{t("filters.all")}</option>
              <option value="video">{t("filters.video")}</option>
              <option value="tekst">{t("filters.text")}</option>
            </select>
          </div>

          <div className="filter-group">
            <label>{t("filters.sortby")}</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}>
              <option value="alphabetical">{t("filters.alphabetical")}</option>
              <option value="newest">{t("sort.newest")}</option>
              <option value="oldest">{t("sort.oldest")}</option>
            </select>
          </div>

          <div className="filter-group checkbox-group">
            <input
              type="checkbox"
              id="onlyMine"
              checked={onlySaved}
              onChange={(e) => setOnlySaved(e.target.checked)}
            />
            <label htmlFor="onlyMine">{t("filters.saved")}</label>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseFilter;
