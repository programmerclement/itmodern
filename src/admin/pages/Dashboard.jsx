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

const STAT_CARDS = [
  { key: 'totalRevenue', icon: DollarSign, label: 'Total revenue', tone: 'emerald', formatter: formatCurrency },
  { key: 'totalOrders', icon: ShoppingCart, label: 'Total orders', tone: 'brand' },
  { key: 'totalCustomers', icon: Users, label: 'Customers', tone: 'violet' },
  { key: 'totalProducts', icon: Package, label: 'Products', tone: 'accent' },
  { key: 'lowStockCount', icon: AlertTriangle, label: 'Low stock', tone: 'amber' },
  { key: 'outOfStockCount', icon: PackageX, label: 'Out of stock', tone: 'rose' },
  { key: 'pendingOrders', icon: Clock, label: 'Pending orders', tone: 'sky' },
  { key: 'pendingPayments', icon: CreditCard, label: 'Pending payments', tone: 'amber' },
];

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboard();

  if (isLoading) return <PageLoader label="Loading dashboard" />;
  if (isError || !data) return <ErrorState title="Could not load dashboard" onRetry={refetch} />;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-slate-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {STAT_CARDS.map((stat, index) => (
          <StatCard
            key={stat.key}
            icon={stat.icon}
            label={stat.label}
            value={data[stat.key]}
            formatter={stat.formatter}
            tone={stat.tone}
            style={{ animationDelay: `${index * 60}ms` }}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="animate-fade-in-up lg:col-span-2" style={{ animationDelay: '260ms' }}>
          <CardHeader>
            <CardTitle>Revenue — last 30 days</CardTitle>
          </CardHeader>
          <CardBody>
            <SalesOverTimeChart data={data.salesOverTime} />
          </CardBody>
        </Card>

        <Card className="animate-fade-in-up" style={{ animationDelay: '320ms' }}>
          <CardHeader>
            <CardTitle>Best-selling products</CardTitle>
          </CardHeader>
          <CardBody>
            <BestSellingList products={data.bestSelling} />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="animate-fade-in-up" style={{ animationDelay: '380ms' }}>
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
