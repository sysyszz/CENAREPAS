import React from 'react';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800/60 ${className}`}
      {...props}
    />
  );
}

export function TableSkeletonRows({ columnsCount = 5, rowsCount = 5, hasRowActions = true }) {
  const totalCols = columnsCount + (hasRowActions ? 1 : 0);
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, rIdx) => (
        <tr key={rIdx} className="border-b border-border/50">
          {Array.from({ length: totalCols }).map((_, cIdx) => (
            <td key={cIdx} className="px-6 py-4">
              <Skeleton 
                className={`h-4 ${
                  cIdx === 0 
                    ? 'w-20' 
                    : cIdx === totalCols - 1 
                    ? 'w-16 ml-auto' 
                    : cIdx % 2 === 0 
                    ? 'w-32' 
                    : 'w-24'
                }`} 
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-panel pb-8">
      {/* Header Skeleton */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-8 w-80 sm:w-96" />
        </div>
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>

      {/* 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mb-7">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-card dark:bg-[#111820] rounded-3xl p-5.5 border border-border dark:border-[rgba(148,163,184,0.14)] flex flex-col justify-between h-[160px]"
          >
            <div className="flex items-center justify-between mb-3.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-9 rounded-full" />
            </div>
            <Skeleton className="h-8 w-36 mb-2.5" />
            <div className="flex items-center justify-between pt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* 4 Insumos / CTA Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 mb-7">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-card dark:bg-[#111820] rounded-3xl p-5.5 border border-border dark:border-[rgba(148,163,184,0.14)] flex flex-col justify-between h-[175px]"
          >
            <div className="flex items-center gap-2.5 mb-3.5">
              <Skeleton className="size-8.5 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-baseline justify-between mb-2.5">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* 2 Main Panels Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-4.5 mb-7">
        <div className="bg-card dark:bg-[#111820] rounded-3xl p-6 border border-border dark:border-[rgba(148,163,184,0.14)] h-[240px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-12 w-48" />
          <div className="flex gap-2.5">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
        </div>

        <div className="bg-card dark:bg-[#111820] rounded-3xl p-6 border border-border dark:border-[rgba(148,163,184,0.14)] h-[240px] flex flex-col justify-between">
          <div className="space-y-1.5 mb-4">
            <Skeleton className="h-4.5 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-end justify-between gap-3 h-32 pt-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton className={`w-full max-w-[48px] rounded-t-xl ${idx === 1 ? 'h-24' : idx === 0 ? 'h-20' : 'h-14'}`} />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
