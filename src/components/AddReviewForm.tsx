import { useState } from 'react';
import type { Review } from '../types';

interface AddReviewFormProps {
  restroomId: string;
  onSubmit: (review: Omit<Review, 'id' | 'createdAt' | 'flags'>) => void;
  onCancel: () => void;
}

const AddReviewForm = ({ restroomId, onSubmit, onCancel }: AddReviewFormProps) => {
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    onSubmit({
      restroomId,
      userId: 'guest-user', // TODO: Use actual user ID from auth
      userName: 'Guest User', // TODO: Use actual user name from auth
      rating,
      comment: comment.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          How was your experience?
        </label>
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => setRating('up')}
            className={`flex-1 py-8 rounded-xl border-2 transition-all ${
              rating === 'up'
                ? 'bg-green-50 border-green-500 shadow-md'
                : 'bg-white border-gray-300 hover:border-green-300'
            }`}
          >
            <div className="text-5xl mb-2">👍</div>
            <div className="font-medium text-gray-900">Positive</div>
          </button>
          <button
            type="button"
            onClick={() => setRating('down')}
            className={`flex-1 py-8 rounded-xl border-2 transition-all ${
              rating === 'down'
                ? 'bg-red-50 border-red-500 shadow-md'
                : 'bg-white border-gray-300 hover:border-red-300'
            }`}
          >
            <div className="text-5xl mb-2">👎</div>
            <div className="font-medium text-gray-900">Negative</div>
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-900 mb-2">
          Additional Comments (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience to help others..."
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!rating}
          className="flex-1 py-3 px-6 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};

export default AddReviewForm;
