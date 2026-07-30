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
  <div>
    <label className="block mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
    />
  </div>
);