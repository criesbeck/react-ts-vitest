import { useState } from 'react';
import type { Issue } from '../types';

interface ReportIssueFormProps {
    restroomId: string;
    onSubmit: (issue: Omit<Issue, 'id' | 'createdAt' | 'isResolved'>) => void;
    onCancel: () => void;
}

const ReportIssueForm = ({ restroomId, onSubmit, onCancel }: ReportIssueFormProps) => {
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        onSubmit({
            restroomId,
            description: description.trim(),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                    Describe the Issue
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Sink is clogged, out of paper towels..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
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
                    disabled={!description.trim()}
                    className="flex-1 py-3 px-6 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Report Issue
                </button>
            </div>
        </form>
    );
};

export default ReportIssueForm;
