// components/AuthHeader.jsx
export const AuthHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="text-center mb-8">
    {Icon && (
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFFBF0] text-[#C1502D] mb-4 shadow-sm border border-[#C1502D]/20">
        <Icon className="w-6 h-6" />
      </div>
    )}
    <h2 className="text-2xl font-bold tracking-tight text-[#2D2926]">{title}</h2>
    {subtitle && <p className="text-sm text-[#756F6A] mt-1">{subtitle}</p>}
  </div>
);