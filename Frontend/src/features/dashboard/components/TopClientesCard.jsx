const LIGHT_BG = '#f5ecd8';

export function TopClientesCard({ clientes = [] }) {
  return (
    <div className="rounded-[1.25rem] border border-[#e8dcc0] bg-white p-7">
      <p className="mb-0.5 text-[1.05rem] font-semibold text-[#2a1206]">Top Clientes</p>
      <p className="mb-[18px] text-[0.8rem] text-[#78633f]">Por número de pedidos este mes</p>
      <div className="flex flex-col gap-4">
        {clientes.map((cliente) => {
          const isLight = cliente.color === LIGHT_BG;
          return (
            <div key={cliente.id} className="flex items-center gap-3.5">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[0.85rem] font-semibold"
                style={{
                  backgroundColor: cliente.color,
                  color: isLight ? '#8a3418' : '#fffbf0',
                  border: isLight ? '1px solid #e8dcc0' : 'none',
                }}
              >
                {cliente.iniciales}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.9rem] font-medium text-[#2a1206]">{cliente.nombre}</p>
                <p className="text-[0.78rem] text-[#78633f]">{cliente.pedidos} pedidos</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
