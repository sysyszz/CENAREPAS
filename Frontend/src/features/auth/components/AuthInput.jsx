// components/AuthInput.jsx

export const AuthInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete,
}) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-xs font-semibold text-[#756F6A] uppercase tracking-wider mb-1">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 bg-[#FFFBF0]/60 border border-[#E8E1D7] rounded-xl text-sm text-[#2D2926] placeholder-[#756F6A]/60 focus:outline-none focus:ring-2 focus:ring-[#C1502D]/30 focus:border-[#C1502D] focus:bg-white transition-all shadow-xs"
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
    />
  </div>
);