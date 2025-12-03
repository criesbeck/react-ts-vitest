import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
  onFlag?: (reviewId: string) => void;
}

const ReviewCard = ({ review, onFlag }: ReviewCardProps) => {
  const isPositive = review.rating === 'up';

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-2xl ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '👍' : '👎'}
          </span>
          <div>
            <p className="font-medium text-gray-900">{review.userName}</p>
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {onFlag && (
          <button
            onClick={() => onFlag(review.id)}
            className="text-gray-400 hover:text-red-500 text-sm"
            aria-label="Report review"
          >
            🚩 Report
          </button>
        )}
      </div>
      {review.comment && (
        <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
      )}
    </div>
  );
};

export default ReviewCard;
