import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, FolderTree, Search } from 'lucide-react';
import { Card, CardBody } from '../../components/common/Card.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import CategoryFormModal from '../components/CategoryFormModal.jsx';
import { useAdminCategories, ADMIN_CATEGORIES_KEY } from '../../hooks/useAdminCategories.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as categoryService from '../../services/categoryService.js';

export default function Categories() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminCategories({ search: search || undefined, page, limit: 10 });
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY });

  const openAdd = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, payload);
        toast.success('Category updated');
      } else {
        await categoryService.createCategory(payload);
        toast.success('Category created');
      }
      invalidate();
      setModalOpen(false);
    } catch (err) {
      toast.error('Could not save category', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    try {
      await categoryService.deleteCategory(category._id);
      toast.success('Category deleted');
      invalidate();
    } catch (err) {
      toast.error('Could not delete category', err.message);
    }
  };

  const categories = data?.categories;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Categories</h1>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
          Add category
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search categories..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
      </div>

      {isLoading ? (
        <PageLoader label="Loading categories" />
      ) : categories?.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="No categories found"
          description="Try adjusting your search."
          action={<Button onClick={openAdd}>Add category</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories?.map((category) => (
              <Card key={category._id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-900">{category.name}</h3>
                        {!category.isActive && <Badge variant="neutral">Inactive</Badge>}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">{category.description}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        {category.specFields?.length ?? 0} spec field{category.specFields?.length === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(category)}
                      aria-label="Edit category"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(category)}
                      aria-label="Delete category"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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

      <CategoryFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        category={editingCategory}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
