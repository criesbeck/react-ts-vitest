import type { RestroomWithDistance, Review, Issue } from '../types';
import { formatDistance } from '../utils/geolocation';
import ReviewCard from '../components/ReviewCard';

interface RestroomDetailProps {
  restroom: RestroomWithDistance;
  reviews: Review[];
  issues: Issue[];
  onClose: () => void;
  onAddReview: () => void;
  onReportIssue: () => void;
  onResolveIssue: (issueId: string) => void;
}

const RestroomDetail = ({ restroom, reviews, issues, onClose, onAddReview, onReportIssue, onResolveIssue }: RestroomDetailProps) => {
  const openInMaps = () => {
    const { latitude, longitude } = restroom.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const statusColors = {
    open: 'bg-green-100 text-green-800 border-green-300',
    closed: 'bg-red-100 text-red-800 border-red-300',
    cleaning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    blocked: 'bg-orange-100 text-orange-800 border-orange-300',
  };

  const statusLabels = {
    open: 'Open',
    closed: 'Closed',
    cleaning: 'Closed for Cleaning',
    blocked: 'Temporarily Blocked',
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{restroom.buildingName}</h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="text-gray-600">{restroom.floor} • {restroom.name}</p>
      </div>

      {/* Status */}
      <div className={`inline-flex items-center px-4 py-2 rounded-lg border-2 mb-4 ${statusColors[restroom.status]}`}>
        <span className="font-semibold">{statusLabels[restroom.status]}</span>
      </div>

      {/* Distance & Time */}
      <div className="bg-purple-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Distance</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatDistance(restroom.distance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Walk Time</p>
            <p className="text-2xl font-bold text-purple-600">
              {restroom.estimatedWalkTime} min
            </p>
          </div>
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Accessibility Features</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 rounded-lg border-2 ${restroom.isWheelchairAccessible ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-300'}`}>
            <div className="text-2xl mb-1">♿</div>
            <div className="text-sm font-medium">
              {restroom.isWheelchairAccessible ? 'Wheelchair Accessible' : 'Not Wheelchair Accessible'}
            </div>
          </div>
          <div className={`p-4 rounded-lg border-2 ${restroom.isGenderNeutral ? 'bg-purple-50 border-purple-300' : 'bg-gray-50 border-gray-300'}`}>
            <div className="text-2xl mb-1">🚻</div>
            <div className="text-sm font-medium">
              {restroom.isGenderNeutral ? 'Gender Neutral' : 'Gendered'}
            </div>
          </div>
          <div className={`p-4 rounded-lg border-2 ${!restroom.requiresWildcard ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
            <div className="text-2xl mb-1">🔓</div>
            <div className="text-sm font-medium">
              {restroom.requiresWildcard ? 'Requires Wildcard' : 'No Wildcard Needed'}
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Notes */}
      {restroom.accessibilityNotes && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Notes</h2>
          <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
            {restroom.accessibilityNotes}
          </p>
        </div>
      )}

      {/* Navigation Button */}
      <button
        onClick={openInMaps}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-colors duration-200 mb-6"
      >
        🗺️ Open in Maps
      </button>

      {/* Issues Section */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Reported Issues</h2>
        {issues.length > 0 ? (
          <div className="space-y-3">
            {issues.map((issue) => (
              <div key={issue.id} className="bg-red-50 border border-red-100 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <p className="text-gray-800 text-sm flex-1">{issue.description}</p>
                  {issue.isResolved ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded ml-2 whitespace-nowrap">
                      ✅ Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => onResolveIssue(issue.id)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-medium px-2 py-1 rounded ml-2 whitespace-nowrap transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Reported on {issue.createdAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">No issues reported.</p>
        )}
      </div>

      {/* Reviews Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-900">Community Reviews</h2>
          <button
            onClick={onAddReview}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            + Add Review
          </button>
        </div>
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to share your experience!
          </p>
        )}
      </div>

      {/* Report Button */}
      <button
        onClick={onReportIssue}
        className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 font-medium py-3 px-6 rounded-xl transition-colors duration-200"
      >
        🚩 Report an Issue
      </button>
    </div>
  );
};

export default RestroomDetail;
