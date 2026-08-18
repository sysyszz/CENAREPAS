
export const CodeInput = ({ code, setCode, error }) => {
  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            className="w-12 h-12 text-center text-xl border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        ))}
      </div>
      {error && <p className="text-destructive text-sm text-center">{error}</p>}
    </div>
  );
};