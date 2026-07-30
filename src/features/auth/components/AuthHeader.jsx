// components/AuthHeader.jsx

export const AuthHeader = ({ icon: Icon, title, subtitle }) => (
  <>
    <div className="flex items-center justify-center mb-8">
      <div className="bg-primary p-3 rounded-lg">
        <Icon className="w-8 h-8 text-primary-foreground" />
      </div>
    </div>
    <h1 className="text-center mb-2">{title}</h1>
    <p className="text-center text-muted-foreground mb-6">{subtitle}</p>
  </>
);