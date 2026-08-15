import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  PackageX,
  Clock,
  CreditCard,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '../../components/common/Card.jsx';
import { PageLoader } from '../../components/common/Loader.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import StatCard from '../components/StatCard.jsx';
import SalesOverTimeChart from '../components/SalesOverTimeChart.jsx';
import RevenueByCategoryChart from '../components/RevenueByCategoryChart.jsx';
import BestSellingList from '../components/BestSellingList.jsx';
import { useDashboard } from '../../hooks/useDashboard.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) return <PageLoader label="Loading dashboard" />;
  if (isError || !data) return <ErrorState title="Could not load dashboard" onRetry={refetch} />;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total revenue" value={formatCurrency(data.totalRevenue)} />
        <StatCard icon={ShoppingCart} label="Total orders" value={data.totalOrders} />
        <StatCard icon={Users} label="Customers" value={data.totalCustomers} />
        <StatCard icon={Package} label="Products" value={data.totalProducts} />
        <StatCard icon={AlertTriangle} label="Low stock" value={data.lowStockCount} tone="warning" />
        <StatCard icon={PackageX} label="Out of stock" value={data.outOfStockCount} tone="warning" />
        <StatCard icon={Clock} label="Pending orders" value={data.pendingOrders} />
        <StatCard icon={CreditCard} label="Pending payments" value={data.pendingPayments} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue — last 30 days</CardTitle>
          </CardHeader>
          <CardBody>
            <SalesOverTimeChart data={data.salesOverTime} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best-selling products</CardTitle>
          </CardHeader>
          <CardBody>
            <BestSellingList products={data.bestSelling} />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by category</CardTitle>
          </CardHeader>
          <CardBody>
            <RevenueByCategoryChart data={data.revenueByCategory} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
