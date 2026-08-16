import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Tag, Search } from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Badge from '../../components/common/Badge.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import BrandFormModal from '../components/BrandFormModal.jsx';
import { useAdminBrands, ADMIN_BRANDS_KEY } from '../../hooks/useAdminBrands.js';
import { useToast } from '../../context/ToastContext.jsx';
import * as brandService from '../../services/brandService.js';

export default function Brands() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminBrands({ search: search || undefined, page, limit: 10 });
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ADMIN_BRANDS_KEY });

  const openAdd = () => {
    setEditingBrand(null);
    setModalOpen(true);
  };

  const openEdit = (brand) => {
    setEditingBrand(brand);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand._id, payload);
        toast.success('Brand updated');
      } else {
        await brandService.createBrand(payload);
        toast.success('Brand created');
      }
      invalidate();
      setModalOpen(false);
    } catch (err) {
      toast.error('Could not save brand', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (brand) => {
    try {
      await brandService.deleteBrand(brand._id);
      toast.success('Brand deleted');
      invalidate();
    } catch (err) {
      toast.error('Could not delete brand', err.message);
    }
  };

  const brands = data?.brands;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Brands</h1>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
          Add brand
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search brands..."
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
        <PageLoader label="Loading brands" />
      ) : brands?.length === 0 ? (
        <EmptyState icon={Tag} title="No brands found" description="Try adjusting your search." action={<Button onClick={openAdd}>Add brand</Button>} />
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {brands?.map((brand) => (
                <Tr key={brand._id}>
                  <Td className="font-medium text-slate-900">{brand.name}</Td>
                  <Td>
                    <Badge variant={brand.isActive ? 'success' : 'neutral'}>
                      {brand.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(brand)}
                        aria-label="Edit brand"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(brand)}
                        aria-label="Delete brand"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

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

      <BrandFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        brand={editingBrand}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
