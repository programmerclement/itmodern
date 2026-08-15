import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout.jsx';
import AccountLayout from '../components/account/AccountLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { PageLoader } from '../components/common/Loader.jsx';
import Home from '../pages/public/Home.jsx';
import Shop from '../pages/shop/Shop.jsx';
import ProductDetails from '../pages/shop/ProductDetails.jsx';
import Cart from '../pages/shop/Cart.jsx';
import Checkout from '../pages/checkout/Checkout.jsx';
import OrderConfirmation from '../pages/checkout/OrderConfirmation.jsx';
import Account from '../pages/account/Account.jsx';
import Orders from '../pages/account/Orders.jsx';
import OrderDetail from '../pages/account/OrderDetail.jsx';
import Addresses from '../pages/account/Addresses.jsx';
import Wishlist from '../pages/account/Wishlist.jsx';
import Quotations from '../pages/account/Quotations.jsx';
import QuotationDetail from '../pages/account/QuotationDetail.jsx';
import Warranty from '../pages/account/Warranty.jsx';
import WarrantyCheck from '../pages/public/WarrantyCheck.jsx';
import NotFound from '../pages/errors/NotFound.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import ResetPassword from '../pages/auth/ResetPassword.jsx';
import VerifyEmail from '../pages/auth/VerifyEmail.jsx';

// The admin panel is only ever used by admins, so it's kept out of the
// customer-facing bundle entirely and loaded on demand.
const AdminLayout = lazy(() => import('../admin/layouts/AdminLayout.jsx'));
const AdminDashboard = lazy(() => import('../admin/pages/Dashboard.jsx'));
const AdminProducts = lazy(() => import('../admin/pages/Products.jsx'));
const AdminProductForm = lazy(() => import('../admin/pages/ProductForm.jsx'));
const AdminImportProducts = lazy(() => import('../admin/pages/ImportProducts.jsx'));
const AdminCategories = lazy(() => import('../admin/pages/Categories.jsx'));
const AdminBrands = lazy(() => import('../admin/pages/Brands.jsx'));
const AdminOrders = lazy(() => import('../admin/pages/Orders.jsx'));
const AdminOrderDetail = lazy(() => import('../admin/pages/OrderDetail.jsx'));
const AdminCustomers = lazy(() => import('../admin/pages/Customers.jsx'));
const AdminCustomerDetail = lazy(() => import('../admin/pages/CustomerDetail.jsx'));
const AdminInventory = lazy(() => import('../admin/pages/Inventory.jsx'));
const AdminPayments = lazy(() => import('../admin/pages/Payments.jsx'));
const AdminReviews = lazy(() => import('../admin/pages/Reviews.jsx'));
const AdminQuotations = lazy(() => import('../admin/pages/Quotations.jsx'));
const AdminQuotationDetail = lazy(() => import('../admin/pages/QuotationDetail.jsx'));
const AdminCoupons = lazy(() => import('../admin/pages/Coupons.jsx'));
const AdminReports = lazy(() => import('../admin/pages/Reports.jsx'));
const AdminSettings = lazy(() => import('../admin/pages/Settings.jsx'));

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route
          path="/admin"
          element={
            <Suspense fallback={<PageLoader label="Loading admin" />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id" element={<AdminProductForm />} />
          <Route path="products/import" element={<AdminImportProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:orderNumber" element={<AdminOrderDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="customers/:id" element={<AdminCustomerDetail />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="quotations" element={<AdminQuotations />} />
          <Route path="quotations/:quotationNumber" element={<AdminQuotationDetail />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:categorySlug" element={<Shop />} />
        <Route path="/products/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/warranty-check" element={<WarrantyCheck />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />

          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Account />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderNumber" element={<OrderDetail />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="quotations" element={<Quotations />} />
            <Route path="quotations/:quotationNumber" element={<QuotationDetail />} />
            <Route path="warranty" element={<Warranty />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
