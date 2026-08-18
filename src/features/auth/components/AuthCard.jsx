// components/AuthCard.jsx

export const AuthCard = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-full max-w-md mx-auto px-4">
      <div className="bg-card rounded-lg border border-border shadow-lg p-8">
        {children}
      </div>
    </div>
  </div>
);