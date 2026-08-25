export default function StatsGrid({ children, className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' }) {
  return <div className={className}>{children}</div>;
}
