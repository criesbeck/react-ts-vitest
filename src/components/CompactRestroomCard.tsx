import type { RestroomWithDistance } from '../types';
import { formatDistance } from '../utils/geolocation';

interface CompactRestroomCardProps {
  restroom: RestroomWithDistance;
  onClick: () => void;
}

const CompactRestroomCard = ({ restroom, onClick }: CompactRestroomCardProps) => {
  const statusColors = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800',
    cleaning: 'bg-yellow-100 text-yellow-800',
    blocked: 'bg-orange-100 text-orange-800',
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-3 text-left border border-gray-200 hover:border-purple-300"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-900 truncate">{restroom.buildingName}</h3>
          <p className="text-xs text-gray-600 truncate">{restroom.floor}</p>
          
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs font-medium text-purple-600">
              {formatDistance(restroom.distance)}
            </span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-xs text-gray-600">{restroom.estimatedWalkTime} min</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusColors[restroom.status]}`}>
            {restroom.status === 'open' ? '✓' : '✗'}
          </span>
          <div className="flex gap-1">
            {restroom.isWheelchairAccessible && (
              <span className="text-base">♿</span>
            )}
            {restroom.isGenderNeutral && (
              <span className="text-base">🚻</span>
            )}
            {!restroom.requiresWildcard && (
              <span className="text-base">🔓</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default CompactRestroomCard;
