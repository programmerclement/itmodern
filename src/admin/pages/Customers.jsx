import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Users,
  UserPlus,
  Eye,
  UserCheck,
  UserX,
  KeyRound,
  ShieldCheck,
  Shield,
  Trash2,
  UserCog,
} from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatCard from '../components/StatCard.jsx';
import AddUserFormModal from '../components/AddUserFormModal.jsx';
import { useAdminUsers, useAdminUserStats } from '../../hooks/useAdminUsers.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import * as userService from '../../services/userService.js';

function formatJoined(date) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function Customers() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { user: currentUser } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const params = { search: search || undefined, role: role || undefined, status: status || undefined, page, limit: 10 };
  const { data, isLoading, isError, refetch } = useAdminUsers(params);
  const { data: stats } = useAdminUserStats();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
  };

  const handleCreate = async (payload) => {
    setIsCreating(true);
    try {
      await userService.adminCreateUser(payload);
      toast.success('Customer created', 'They will receive an email to set their password.');
      invalidate();
      setAddModalOpen(false);
      return true;
    } catch (err) {
      toast.error('Could not create customer', err.message);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await userService.adminUpdateUserStatus(user.id, nextStatus);
      toast.success(nextStatus === 'active' ? 'Customer activated' : 'Customer suspended');
      invalidate();
    } catch (err) {
      toast.error('Could not update customer', err.message);
    }
  };

  const handleToggleRole = async (user) => {
    const nextRole = user.role === 'admin' ? 'customer' : 'admin';
    try {
      await userService.adminUpdateUserRole(user.id, nextRole);
      toast.success(nextRole === 'admin' ? 'Promoted to admin' : 'Moved to customer role');
      invalidate();
    } catch (err) {
      toast.error('Could not update role', err.message);
    }
  };

  const handleResetPassword = async (user) => {
    try {
      await userService.adminResetUserPassword(user.id);
      toast.success('Password reset email sent', user.email);
    } catch (err) {
      toast.error('Could not send reset email', err.message);
    }
  };

  const handleDelete = async (user) => {
    try {
      await userService.adminDeleteUser(user.id);
      toast.success('Customer deleted');
      invalidate();
    } catch (err) {
      toast.error('Could not delete customer', err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">Customers</h1>
        <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => setAddModalOpen(true)}>
          Add customer
        </Button>
      </div>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard icon={Users} label="Total customers" value={stats.total} tone="brand" />
          <StatCard icon={UserCheck} label="Active" value={stats.active} tone="emerald" />
          <StatCard icon={UserX} label="Suspended" value={stats.suspended} tone="rose" />
          <StatCard icon={ShieldCheck} label="Admins" value={stats.admins} tone="violet" />
          <StatCard icon={UserCog} label="Customers" value={stats.customers} tone="sky" />
        </div>
      )}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          placeholder="Search name, email, phone..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </Select>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>

      {isLoading ? (
        <PageLoader label="Loading customers" />
      ) : isError ? (
        <ErrorState title="Could not load customers" onRetry={refetch} />
      ) : data.users.length === 0 ? (
        <EmptyState icon={Users} title="No customers found" description="Try adjusting your filters." />
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Joined</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.users.map((user) => {
                const isSelf = user.id === currentUser.id;
                return (
                  <Tr key={user.id}>
                    <Td>
                      <Link to={`/admin/customers/${user.id}`} className="font-medium text-slate-900 hover:text-brand-700">
                        {user.name}
                      </Link>
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Badge variant={user.role === 'admin' ? 'brand' : 'neutral'}>{user.role}</Badge>
                    </Td>
                    <Td>
                      <Badge variant={user.status === 'active' ? 'success' : 'danger'}>{user.status}</Badge>
                    </Td>
                    <Td className="text-xs text-slate-500">{formatJoined(user.createdAt)}</Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/customers/${user.id}`}
                          aria-label="View customer"
                          title="View"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleResetPassword(user)}
                          aria-label="Send password reset email"
                          title="Reset password"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleRole(user)}
                          disabled={isSelf}
                          aria-label={user.role === 'admin' ? 'Move to customer role' : 'Promote to admin'}
                          title={isSelf ? "Can't change your own role" : user.role === 'admin' ? 'Move to customer' : 'Promote to admin'}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          {user.role === 'admin' ? (
                            <ShieldCheck className="h-4 w-4 text-brand-600" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user)}
                          disabled={isSelf}
                          aria-label={user.status === 'active' ? 'Suspend customer' : 'Activate customer'}
                          title={isSelf ? "Can't suspend your own account" : user.status === 'active' ? 'Suspend' : 'Activate'}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          {user.status === 'active' ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-emerald-600" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={isSelf}
                          aria-label="Delete customer"
                          title={isSelf ? "Can't delete your own account" : 'Delete'}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>

          {data.pagination.totalPages > 1 && (
            <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} className="mt-6" />
          )}
        </>
      )}

      <AddUserFormModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
      />
    </div>
  );
}
