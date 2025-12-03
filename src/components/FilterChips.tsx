import type { FilterOptions } from '../types';

interface FilterChipsProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
}

const FilterChips = ({ filters, onChange }: FilterChipsProps) => {
  const toggleFilter = (key: keyof FilterOptions) => {
    onChange({
      ...filters,
      [key]: !filters[key],
    });
  };

  const clearAllFilters = () => {
    onChange({
      wheelchairAccessible: false,
      genderNeutral: false,
      wildcardFree: false,
      sortByDistance: filters.sortByDistance, // Keep sort preference
    });
  };

  // Check if any filter is active
  const hasActiveFilters = filters.wheelchairAccessible || filters.genderNeutral || filters.wildcardFree;

  const chipBaseClass = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2";
  const activeClass = "bg-purple-600 text-white border-purple-600";
  const inactiveClass = "bg-white text-gray-700 border-gray-300 hover:border-purple-300";

  return (
    <div className="flex flex-wrap gap-2 p-4 items-center">
      <button
        onClick={() => toggleFilter('wheelchairAccessible')}
        className={`${chipBaseClass} ${filters.wheelchairAccessible ? activeClass : inactiveClass}`}
        aria-pressed={filters.wheelchairAccessible}
      >
        ♿ Wheelchair Accessible
      </button>
      <button
        onClick={() => toggleFilter('genderNeutral')}
        className={`${chipBaseClass} ${filters.genderNeutral ? activeClass : inactiveClass}`}
        aria-pressed={filters.genderNeutral}
      >
        🚻 Gender Neutral
      </button>
      <button
        onClick={() => toggleFilter('wildcardFree')}
        className={`${chipBaseClass} ${filters.wildcardFree ? activeClass : inactiveClass}`}
        aria-pressed={filters.wildcardFree}
      >
        🔓 No Wildcard Needed
      </button>
      
      {/* Clear Filters Button - Only show when filters are active */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200 hover:border-red-400"
          aria-label="Clear all filters"
        >
          ✕ Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterChips;
