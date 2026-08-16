import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, X, MessageSquareText, Search } from 'lucide-react';
import { Card, CardBody } from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import StarRating from '../../components/product/StarRating.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as reviewService from '../../services/reviewService.js';

const STATUS_VARIANT = { pending: 'warning', approved: 'success', rejected: 'danger' };

export default function Reviews() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const toast = useToast();

  const params = { search: search || undefined, status: status || undefined, page, limit: 10 };
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: () => reviewService.adminGetReviews(params),
    placeholderData: (previous) => previous,
    select: (result) => result.data,
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
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Reviews</h1>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search product, customer, review text..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-[180px]"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </Select>
      </div>

      {isLoading ? (
        <PageLoader label="Loading reviews" />
      ) : data?.reviews.length === 0 ? (
        <EmptyState icon={MessageSquareText} title="No reviews here" description="Try adjusting your filters." />
      ) : (
        <>
          <div className="space-y-3">
            {data?.reviews.map((review) => (
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
                          {review.user?.name}
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

          {data?.pagination.totalPages > 1 && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
              className="mt-6"
            />
          )}
        </>
      )}
    </div>
  );
}
