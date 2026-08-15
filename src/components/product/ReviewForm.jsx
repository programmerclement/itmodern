import { useState } from 'react';
import StarRating from './StarRating.jsx';
import Input from '../common/Input.jsx';
import Textarea from '../common/Textarea.jsx';
import Button from '../common/Button.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as reviewService from '../../services/reviewService.js';

export default function ReviewForm({ productId, onSubmitted }) {
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (rating === 0) {
      toast.error('Select a star rating');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.createReview({ productId, rating, title, comment });
      toast.success('Review submitted', 'It will appear once approved.');
      setRating(0);
      setTitle('');
      setComment('');
      onSubmitted?.();
    } catch (err) {
      toast.error('Could not submit review', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Your rating</p>
        <StarRating value={rating} onChange={setRating} size="lg" readOnly={false} />
      </div>
      <Input label="Title" placeholder="Optional" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea
        label="Review"
        placeholder="Share your experience with this product"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button type="submit" isLoading={isSubmitting}>
        Submit review
      </Button>
    </form>
  );
}
