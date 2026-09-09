import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      duration={3500}
      closeButton={true}
      expand={false}
      visibleToasts={4}
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-white shrink-0 stroke-[2.5]" />,
        error: <AlertCircle className="w-5 h-5 text-white shrink-0 stroke-[2.5]" />,
        warning: <AlertTriangle className="w-5 h-5 text-slate-900 shrink-0 stroke-[2.5]" />,
        info: <Info className="w-5 h-5 text-white shrink-0 stroke-[2.5]" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'relative flex items-center gap-3 px-4 py-3.5 pr-9 rounded-xl shadow-xl min-w-[280px] sm:min-w-[320px] max-w-md border font-medium text-sm text-white pointer-events-auto transition-all',
          success: 'bg-[#5A7A3A] border-[#4A6630] shadow-[#5A7A3A]/25',
          error: 'bg-[#C1502D] border-[#A23F21] shadow-[#C1502D]/25',
          warning: 'bg-[#E8B23D] border-[#C4932A] text-slate-900 shadow-[#E8B23D]/25',
          info: 'bg-[#2E5B82] border-[#204361] shadow-[#2E5B82]/25',
          closeButton:
            '!bg-white/20 hover:!bg-white/35 !text-white !border-0 !left-auto !right-2.5 !top-1/2 !-translate-y-1/2 !rounded-full !w-6 !h-6 !p-0 !flex !items-center !justify-center !transition-colors !cursor-pointer',
        },
      }}
    />
  );
}

export default Toaster;
