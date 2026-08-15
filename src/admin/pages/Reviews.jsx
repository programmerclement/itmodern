import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X, MessageSquareText } from 'lucide-react';
import { Card, CardBody } from '../../components/common/Card.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import StarRating from '../../components/product/StarRating.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as reviewService from '../../services/reviewService.js';

const STATUS_VARIANT = { pending: 'warning', approved: 'success', rejected: 'danger' };

export default function Reviews() {
  const [status, setStatus] = useState('pending');
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'reviews', status],
    queryFn: () => reviewService.adminGetReviews({ status: status || undefined, limit: 50 }),
    select: (result) => result.data.reviews,
  });

  const handleModerate = async (id, nextStatus) => {
    try {
      await reviewService.moderateReview(id, nextStatus);
      toast.success(nextStatus === 'approved' ? 'Review approved' : 'Review rejected');
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    } catch (err) {
      toast.error('Could not update review', err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Reviews</h1>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="max-w-[180px]">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </Select>
      </div>

      {isLoading ? (
        <PageLoader label="Loading reviews" />
      ) : data?.length === 0 ? (
        <EmptyState icon={MessageSquareText} title="No reviews here" />
      ) : (
        <div className="space-y-3">
          {data?.map((review) => (
            <Card key={review._id}>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <StarRating value={review.rating} size="sm" />
                      <Badge variant={STATUS_VARIANT[review.status]}>{review.status}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-slate-900">
                      {review.product?.name} &middot;{' '}
                      <span className="font-normal text-slate-500">
                        {review.user?.firstName} {review.user?.lastName}
                      </span>
                    </p>
                    {review.title && <p className="mt-1 text-sm font-medium text-slate-800">{review.title}</p>}
                    {review.comment && <p className="mt-1 text-sm text-slate-600">{review.comment}</p>}
                  </div>
                  {review.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" leftIcon={<Check className="h-4 w-4" />} onClick={() => handleModerate(review._id, 'approved')}>
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<X className="h-4 w-4" />}
                        onClick={() => handleModerate(review._id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
