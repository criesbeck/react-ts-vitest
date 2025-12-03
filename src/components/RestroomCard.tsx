import type { RestroomWithDistance } from '../types';
import { formatDistance } from '../utils/geolocation';

interface RestroomCardProps {
  restroom: RestroomWithDistance;
  onClick: () => void;
}

const RestroomCard = ({ restroom, onClick }: RestroomCardProps) => {
  const statusColors = {
    open: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800',
    cleaning: 'bg-yellow-100 text-yellow-800',
    blocked: 'bg-orange-100 text-orange-800',
  };

  const statusLabels = {
    open: 'Open',
    closed: 'Closed',
    cleaning: 'Cleaning',
    blocked: 'Blocked',
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 text-left"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{restroom.buildingName}</h3>
          <p className="text-sm text-gray-600">{restroom.floor} • {restroom.name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[restroom.status]}`}>
          {statusLabels[restroom.status]}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="font-medium text-purple-600">
          {formatDistance(restroom.distance)} • {restroom.estimatedWalkTime} min walk
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {restroom.isWheelchairAccessible && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium">
            <span className="text-lg">♿</span> Accessible
          </span>
        )}
        {restroom.isGenderNeutral && (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm font-medium">
            <span className="text-lg">🚻</span> Gender Neutral
          </span>
        )}
        {!restroom.requiresWildcard && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
            <span className="text-lg">🔓</span> No Wildcard
          </span>
        )}
      </div>

      {restroom.accessibilityNotes && (
        <p className="mt-3 text-sm text-gray-600 italic">
          {restroom.accessibilityNotes}
        </p>
      )}
    </button>
  );
};

export default RestroomCard;
