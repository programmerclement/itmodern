import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MessageSquareText } from 'lucide-react';
import StarRating from './StarRating.jsx';
import ReviewForm from './ReviewForm.jsx';
import Button from '../common/Button.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { useProductReviews, useCanReview } from '../../hooks/useReviews.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getShortDisplayName } from '../../utils/name.js';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ReviewsSection({ product }) {
  const productId = product.id ?? product._id;
  const { isAuthenticated } = useAuth();
  const { data: reviewsData, isLoading } = useProductReviews(productId);
  const { data: eligibility } = useCanReview(productId);
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const reviews = reviewsData?.reviews ?? [];

  const handleSubmitted = () => {
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ['reviews', 'product', productId] });
    queryClient.invalidateQueries({ queryKey: ['reviews', 'can-review', productId] });
  };

  return (
    <section className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Reviews</h2>
          {product.ratingsCount > 0 ? (
            <div className="mt-1 flex items-center gap-2">
              <StarRating value={Math.round(product.ratingsAverage)} />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {product.ratingsAverage.toFixed(1)} ({product.ratingsCount} review{product.ratingsCount === 1 ? '' : 's'})
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">No reviews yet</p>
          )}
        </div>

        {isAuthenticated && eligibility?.canReview && !showForm && (
          <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
            Write a review
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-6">
          <ReviewForm productId={productId} onSubmitted={handleSubmitted} />
        </div>
      )}

      {isAuthenticated && eligibility && !eligibility.canReview && eligibility.reason && !showForm && (
        <p className="mb-6 text-xs text-slate-400 dark:text-slate-500">{eligibility.reason}</p>
      )}

      {!isLoading && reviews.length === 0 ? (
        <EmptyState icon={MessageSquareText} title="No reviews yet" description="Be the first to review this product." />
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-slate-100 pb-5 last:border-0 dark:border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} size="sm" />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {getShortDisplayName(review.user?.name)}
                  </span>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(review.createdAt)}</span>
              </div>
              {review.title && (
                <p className="mt-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">{review.title}</p>
              )}
              {review.comment && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
