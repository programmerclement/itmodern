import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../components/common/Table.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Badge from '../../components/common/Badge.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useAdminUsers } from '../../hooks/useAdminUsers.js';

export default function Customers() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);

  const params = { search: search || undefined, role: role || undefined, page, limit: 20 };
  const { data, isLoading, isError, refetch } = useAdminUsers(params);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Customers</h1>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder="Search name, email, phone..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-xs"
        />
        <Select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="sm:max-w-[180px]"
        >
          <option value="">All roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
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
              </Tr>
            </Thead>
            <Tbody>
              {data.users.map((user) => (
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
                  <Td className="text-xs text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {data.pagination.totalPages > 1 && (
            <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} className="mt-6" />
          )}
        </>
      )}
    </div>
  );
}
