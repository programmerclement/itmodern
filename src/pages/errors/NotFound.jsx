import Button from '../../components/common/Button.jsx';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Page not found</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button to="/" className="mt-6">
        Back to home
      </Button>
    </div>
  );
}
