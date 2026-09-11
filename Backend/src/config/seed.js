import bcrypt from 'bcryptjs';
import { query, pool } from './db.js';

async function seed() {
  console.log('🌱 [Seed]: Iniciando siembra de datos con constraints correctos en cenarepas_db...');

  try {
    // 1. Permisos
    const modulos = [
      'roles', 'usuarios', 'proveedores', 'insumos', 'compras', 
      'fichas-tecnicas', 'categorias', 'productos', 'produccion', 
      'clientes', 'pedidos', 'ventas', 'sedes', 'abonos', 'dashboard'
    ];
    const acciones = ['ver', 'crear', 'editar', 'eliminar'];

    for (const mod of modulos) {
      for (const acc of acciones) {
        await query(`
          INSERT INTO permiso (modulo, accion, estado)
          VALUES ($1, $2, 'Activo')
          ON CONFLICT (modulo, accion) DO NOTHING
        `, [mod, acc]);
      }
    }
    console.log('✅ Permisos creados.');

    // 2. Asignar permisos a Rol 1 (Administrador)
    const allPermisos = await query('SELECT id_permiso FROM permiso');
    for (const p of allPermisos.rows) {
      await query(`
        INSERT INTO rol_permiso (id_rol, id_permiso)
        VALUES (1, $1)
        ON CONFLICT DO NOTHING
      `, [p.id_permiso]);
    }
    console.log('✅ Permisos asignados al Administrador.');

    // 3. Usuarios iniciales
    const hashPassword = await bcrypt.hash('admin123', 10);
    const users = [
      { nombre: 'Administrador General', correo: 'admin@sistema.com', id_rol: 1 },
      { nombre: 'Laura Gómez (Secretaria)', correo: 'secretaria@cenarepas.com', id_rol: 2 },
      { nombre: 'Carlos Ruiz (Vendedor)', correo: 'vendedor@cenarepas.com', id_rol: 3 },
      { nombre: 'Diego Morales (Domicilios)', correo: 'domicilios@cenarepas.com', id_rol: 4 },
    ];

    for (const u of users) {
      await query(`
        INSERT INTO usuario (nombre, correo, contrasena_hash, id_rol, estado)
        VALUES ($1, $2, $3, $4, 'Activo')
        ON CONFLICT (correo) DO UPDATE 
        SET contrasena_hash = EXCLUDED.contrasena_hash, id_rol = EXCLUDED.id_rol, nombre = EXCLUDED.nombre, estado = 'Activo'
      `, [u.nombre, u.correo, hashPassword, u.id_rol]);
    }
    console.log('✅ Usuarios iniciales creados.');

    // 4. Proveedores
    const proveedores = [
      { nombre: 'Molinos y Harinas El Sol S.A.S.', nit: '900.123.456-1', telefono: '3104567890', correo: 'ventas@harinaselsol.com', direccion: 'Cra 50 # 45-20, Zona Industrial' },
      { nombre: 'Lácteos del Valle & Quesos', nit: '890.987.654-2', telefono: '3117894561', correo: 'contacto@lacteosvalle.com', direccion: 'Av Regional # 12-80' },
      { nombre: 'Empaques y Soluciones Plásticas', nit: '901.345.678-3', telefono: '3156781234', correo: 'pedidos@empaquessa.com', direccion: 'Calle 33 # 65-14' },
      { nombre: 'Distribuidora Cárnica San Martín', nit: '900.876.543-4', telefono: '3189012345', correo: 'sanmartin@carnicos.com', direccion: 'Cra 65 # 28-90' }
    ];

    for (const prov of proveedores) {
      await query(`
        INSERT INTO proveedor (nombre, nit, telefono, correo, direccion, estado)
        VALUES ($1, $2, $3, $4, $5, 'Activo')
        ON CONFLICT (nit) DO UPDATE 
        SET nombre = EXCLUDED.nombre, telefono = EXCLUDED.telefono, correo = EXCLUDED.correo, direccion = EXCLUDED.direccion, estado = 'Activo'
      `, [prov.nombre, prov.nit, prov.telefono, prov.correo, prov.direccion]);
    }
    console.log('✅ Proveedores creados.');

    // 5. Insumos
    const provSol = (await query("SELECT id_proveedor FROM proveedor WHERE nit = '900.123.456-1'")).rows[0]?.id_proveedor || 1;
    const provLac = (await query("SELECT id_proveedor FROM proveedor WHERE nit = '890.987.654-2'")).rows[0]?.id_proveedor || 1;
    const provEmp = (await query("SELECT id_proveedor FROM proveedor WHERE nit = '901.345.678-3'")).rows[0]?.id_proveedor || 1;
    const provCar = (await query("SELECT id_proveedor FROM proveedor WHERE nit = '900.876.543-4'")).rows[0]?.id_proveedor || 1;

    const insumos = [
      { nombre: 'Harina de Maíz Blanco Precristalizada', unidad_medida: 'Kg', stock_actual: 450, stock_minimo: 80, fecha_vencimiento: '2026-12-31', id_proveedor: provSol },
      { nombre: 'Harina de Maíz Amarillo Selecta', unidad_medida: 'Kg', stock_actual: 320, stock_minimo: 60, fecha_vencimiento: '2026-11-30', id_proveedor: provSol },
      { nombre: 'Queso Mozzarella Rallado Especial', unidad_medida: 'Kg', stock_actual: 180, stock_minimo: 40, fecha_vencimiento: '2026-10-15', id_proveedor: provLac },
      { nombre: 'Queso Doble Crema Bloque', unidad_medida: 'Kg', stock_actual: 120, stock_minimo: 30, fecha_vencimiento: '2026-10-20', id_proveedor: provLac },
      { nombre: 'Mantequilla Industrial Pura', unidad_medida: 'Kg', stock_actual: 65, stock_minimo: 15, fecha_vencimiento: '2026-10-30', id_proveedor: provLac },
      { nombre: 'Sal Refinada Marina', unidad_medida: 'Kg', stock_actual: 90, stock_minimo: 20, fecha_vencimiento: '2027-01-01', id_proveedor: provSol },
      { nombre: 'Pechuga de Pollo Desmechada', unidad_medida: 'Kg', stock_actual: 85, stock_minimo: 20, fecha_vencimiento: '2026-09-30', id_proveedor: provCar },
      { nombre: 'Carne de Res Desmechada Sazonada', unidad_medida: 'Kg', stock_actual: 95, stock_minimo: 25, fecha_vencimiento: '2026-09-30', id_proveedor: provCar },
      { nombre: 'Bolsas Termoencogibles x100 und', unidad_medida: 'Paquete', stock_actual: 150, stock_minimo: 30, fecha_vencimiento: null, id_proveedor: provEmp }
    ];

    const insumoCount = await query('SELECT count(*) FROM insumo');
    if (parseInt(insumoCount.rows[0].count) === 0) {
      for (const ins of insumos) {
        await query(`
          INSERT INTO insumo (nombre, unidad_medida, stock_actual, stock_minimo, fecha_vencimiento, id_proveedor, estado)
          VALUES ($1, $2, $3, $4, $5, $6, 'Activo')
        `, [ins.nombre, ins.unidad_medida, ins.stock_actual, ins.stock_minimo, ins.fecha_vencimiento, ins.id_proveedor]);
      }
      console.log('✅ Insumos creados.');
    }

    // 6. Categorías de Producto
    const categorias = [
      { nombre: 'Arepas Tradicionales de Maíz', descripcion: 'Arepas clásicas elaboradas con puro maíz seleccionado' },
      { nombre: 'Arepas Rellenas Especiales', descripcion: 'Arepas generosamente rellenas de queso, pollo, carne o mixtas' },
      { nombre: 'Arepas Gourmet & Chócolo', descripcion: 'Recetas de autor, arepas de chócolo dulce y combinaciones premium' },
      { nombre: 'Bebidas y Complementos', descripcion: 'Bebidas artesanales, jugos naturales y acompañamientos' }
    ];

    for (const cat of categorias) {
      await query(`
        INSERT INTO categoria_producto (nombre, descripcion, estado)
        VALUES ($1, $2, 'Activo')
        ON CONFLICT (nombre) DO UPDATE SET descripcion = EXCLUDED.descripcion, estado = 'Activo'
      `, [cat.nombre, cat.descripcion]);
    }
    console.log('✅ Categorías creadas.');

    // 7. Fichas Técnicas
    const fichaCount = await query('SELECT count(*) FROM ficha_tecnica');
    if (parseInt(fichaCount.rows[0].count) === 0) {
      const ft1 = await query(`
        INSERT INTO ficha_tecnica (nombre, descripcion, instrucciones_preparacion, tiempo_estimado_minutos, rendimiento_lote, estado)
        VALUES ('Ficha: Arepa con Queso Doble Crema', 'Fórmula estándar para lote de 100 arepas con queso', '1. Hidratar harina con agua tibia y sal. 2. Amasar 10 min. 3. Incorporar mantequilla y queso. 4. Moldear en discos de 120g. 5. Asar 4 min por cara.', 45, 100, 'Activo')
        RETURNING id_ficha
      `);

      const ft2 = await query(`
        INSERT INTO ficha_tecnica (nombre, descripcion, instrucciones_preparacion, tiempo_estimado_minutos, rendimiento_lote, estado)
        VALUES ('Ficha: Arepa Rellena de Pollo y Queso', 'Fórmula para lote de 60 arepas rellenas gourmet', '1. Preparar masa base de maíz blanco. 2. Precocinar base. 3. Abrir bolsillo e insertar 80g de pollo desmechado y 40g queso mozzarella. 4. Sellar al vacío.', 60, 60, 'Activo')
        RETURNING id_ficha
      `);

      const idFt1 = ft1.rows[0]?.id_ficha;
      const idFt2 = ft2.rows[0]?.id_ficha;

      // Insumos asociados
      const insHarina = (await query("SELECT id_insumo FROM insumo WHERE nombre LIKE '%Blanco%' LIMIT 1")).rows[0]?.id_insumo;
      const insQueso = (await query("SELECT id_insumo FROM insumo WHERE nombre LIKE '%Mozzarella%' LIMIT 1")).rows[0]?.id_insumo;
      const insPollo = (await query("SELECT id_insumo FROM insumo WHERE nombre LIKE '%Pollo%' LIMIT 1")).rows[0]?.id_insumo;

      if (idFt1 && insHarina && insQueso) {
        await query(`INSERT INTO ficha_tecnica_insumo (id_ficha, id_insumo, cantidad, unidad_medida) VALUES ($1, $2, 10, 'Kg'), ($1, $3, 5, 'Kg') ON CONFLICT DO NOTHING`, [idFt1, insHarina, insQueso]);
      }
      if (idFt2 && insHarina && insPollo) {
        await query(`INSERT INTO ficha_tecnica_insumo (id_ficha, id_insumo, cantidad, unidad_medida) VALUES ($1, $2, 8, 'Kg'), ($1, $3, 4.8, 'Kg') ON CONFLICT DO NOTHING`, [idFt2, insHarina, insPollo]);
      }
      console.log('✅ Fichas técnicas e ingredientes creados.');
    }

    // 8. Sedes
    const sedes = [
      { nombre: 'Sede Principal - Fábrica Central', direccion: 'Calle 10 # 43E-20, Medellín', telefono: '6044445566', horario_atencion: 'Lun - Sáb: 6:00 AM - 6:00 PM', responsable: 'Carlos Mario Restrepo' },
      { nombre: 'Punto de Venta Norte - Bello', direccion: 'Cra 50 # 38-12, Bello', telefono: '6044445567', horario_atencion: 'Lun - Dom: 7:00 AM - 9:00 PM', responsable: 'Ana María Jaramillo' },
      { nombre: 'Punto de Venta Poblado', direccion: 'Cra 43A # 7-50, Poblado', telefono: '6044445568', horario_atencion: 'Todos los días: 8:00 AM - 10:00 PM', responsable: 'Javier Ortiz' },
      { nombre: 'Punto de Venta Laureles', direccion: 'Circular 4 # 73-10, Laureles', telefono: '6044445569', horario_atencion: 'Todos los días: 7:00 AM - 9:30 PM', responsable: 'Mariana Duque' }
    ];

    const sedeCount = await query('SELECT count(*) FROM sede');
    if (parseInt(sedeCount.rows[0].count) === 0) {
      for (const s of sedes) {
        await query(`
          INSERT INTO sede (nombre, direccion, telefono, horario_atencion, responsable, estado)
          VALUES ($1, $2, $3, $4, $5, 'Activo')
        `, [s.nombre, s.direccion, s.telefono, s.horario_atencion, s.responsable]);
      }
      console.log('✅ Sedes creadas.');
    }

    // 9. Productos
    const catTrad = (await query("SELECT id_categoria FROM categoria_producto WHERE nombre LIKE '%Tradicionales%' LIMIT 1")).rows[0]?.id_categoria || 1;
    const catRell = (await query("SELECT id_categoria FROM categoria_producto WHERE nombre LIKE '%Rellenas%' LIMIT 1")).rows[0]?.id_categoria || 1;
    const catGour = (await query("SELECT id_categoria FROM categoria_producto WHERE nombre LIKE '%Gourmet%' LIMIT 1")).rows[0]?.id_categoria || 1;
    const catBeb = (await query("SELECT id_categoria FROM categoria_producto WHERE nombre LIKE '%Bebidas%' LIMIT 1")).rows[0]?.id_categoria || 1;

    const productos = [
      { nombre: 'Arepa de Queso Doble Crema x5', descripcion: 'Paquete de 5 arepas de tela con generoso queso campesino', id_categoria: catTrad, precio_venta: 12500, stock_actual: 140, stock_minimo: 30, estado: 'Activo' },
      { nombre: 'Arepa Rellena de Pollo y Queso', descripcion: 'Arepa asada rellena de pechuga desmechada sazonada y queso', id_categoria: catRell, precio_venta: 14000, stock_actual: 85, stock_minimo: 20, estado: 'Activo' },
      { nombre: 'Arepa Rellena de Carne Desmechada', descripcion: 'Arepa artesanal con carne de res en reducción criolla y queso fundido', id_categoria: catRell, precio_venta: 15500, stock_actual: 70, stock_minimo: 15, estado: 'Activo' },
      { nombre: 'Arepa Rellena Mixta Trilogía', descripcion: 'Pollo, carne desmechada, tocineta crocante y doble queso', id_categoria: catRell, precio_venta: 18000, stock_actual: 50, stock_minimo: 15, estado: 'Activo' },
      { nombre: 'Arepa de Chócolo con Quesillo', descripcion: 'Arepa de maíz tierno dulce con mantequilla dorada y queso blanco', id_categoria: catGour, precio_venta: 9500, stock_actual: 110, stock_minimo: 25, estado: 'Activo' },
      { nombre: 'Arepa Gourmet Santandereana', descripcion: 'Masa de maíz amarillo con chicharrón molido y toque de yuca', id_categoria: catGour, precio_venta: 13000, stock_actual: 60, stock_minimo: 20, estado: 'Activo' },
      { nombre: 'Jugo Natural de Frutos Rojos 400ml', descripcion: 'Jugo artesanal 100% pulpa natural sin conservantes', id_categoria: catBeb, precio_venta: 6000, stock_actual: 90, stock_minimo: 20, estado: 'Activo' },
      { nombre: 'Chocolate Tradicional Corona 300ml', descripcion: 'Chocolate caliente con toque de canela y clavo', id_categoria: catBeb, precio_venta: 5000, stock_actual: 120, stock_minimo: 30, estado: 'Activo' }
    ];

    const prodCount = await query('SELECT count(*) FROM producto');
    if (parseInt(prodCount.rows[0].count) === 0) {
      for (const p of productos) {
        await query(`
          INSERT INTO producto (nombre, descripcion, id_categoria, precio_venta, stock_actual, stock_minimo, estado)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [p.nombre, p.descripcion, p.id_categoria, p.precio_venta, p.stock_actual, p.stock_minimo, p.estado]);
      }
      console.log('✅ Productos creados.');
    }

    // 10. Clientes
    const clientes = [
      { nombre: 'Restaurante Sabor Colombiano SAS', documento: '901.888.777-5', telefono: '3001234567', correo: 'compras@saborcolombiano.co', direccion: 'Cra 43A # 18 Sur - 40, Medellín' },
      { nombre: 'Cafetería & Panadería La Esquina', documento: '71.234.567', telefono: '3128901234', correo: 'laesquina.cafe@gmail.com', direccion: 'Calle 50 # 70-15, Laureles' },
      { nombre: 'Distribuidora Alimenticia Paisa', documento: '900.555.444-1', telefono: '3157778899', correo: 'contacto@distripaisa.com', direccion: 'Av Guayabal # 10-30' },
      { nombre: 'María Fernanda López', documento: '1.037.654.321', telefono: '3206549870', correo: 'mafe.lopez@outlook.com', direccion: 'Calle 10A # 30-45, Apt 502' },
      { nombre: 'Carlos Eduardo Gómez', documento: '98.765.432', telefono: '3184561230', correo: 'carlos.gomez@gmail.com', direccion: 'Cra 76 # 33-89, Belén' }
    ];

    const clienteCount = await query('SELECT count(*) FROM cliente');
    if (parseInt(clienteCount.rows[0].count) === 0) {
      for (const c of clientes) {
        await query(`
          INSERT INTO cliente (nombre, documento, telefono, correo, direccion, estado)
          VALUES ($1, $2, $3, $4, $5, 'Activo')
        `, [c.nombre, c.documento, c.telefono, c.correo, c.direccion]);
      }
      console.log('✅ Clientes creados.');
    }

    // 11. Producción (Lotes)
    const loteCount = await query('SELECT count(*) FROM lote_produccion');
    const firstFicha = (await query('SELECT id_ficha FROM ficha_tecnica LIMIT 1')).rows[0]?.id_ficha;
    const adminUser = (await query('SELECT id_usuario FROM usuario LIMIT 1')).rows[0]?.id_usuario;

    if (parseInt(loteCount.rows[0].count) === 0 && firstFicha && adminUser) {
      await query(`
        INSERT INTO lote_produccion (id_ficha, id_usuario_responsable, fecha_produccion, cantidad_producida, estado, observaciones)
        VALUES 
          ($1, $2, CURRENT_DATE - INTERVAL '2 day', 150, 'Terminado', 'Lote matutino superó estándar de calidad sensorial'),
          ($1, $2, CURRENT_DATE - INTERVAL '1 day', 200, 'Terminado', 'Producción para pedidos institucionales del fin de semana'),
          ($1, $2, CURRENT_DATE, 120, 'En proceso', 'En proceso de moldeado y control térmico')
      `, [firstFicha, adminUser]);
      console.log('✅ Lotes de producción creados.');
    }

    // 12. Compras
    const compraCount = await query('SELECT count(*) FROM compra');
    if (parseInt(compraCount.rows[0].count) === 0 && adminUser && provSol) {
      const comp1 = await query(`
        INSERT INTO compra (id_proveedor, id_usuario, fecha_compra, valor_total, medio_pago, estado)
        VALUES ($1, $2, CURRENT_DATE - INTERVAL '3 day', 1450000, 'Transferencia', 'Registrada')
        RETURNING id_compra
      `, [provSol, adminUser]);

      const ins1 = (await query('SELECT id_insumo FROM insumo LIMIT 1')).rows[0]?.id_insumo;
      if (ins1 && comp1.rows[0]?.id_compra) {
        await query(`
          INSERT INTO detalle_compra (id_compra, id_insumo, cantidad, valor_unitario, subtotal)
          VALUES ($1, $2, 200, 7250, 1450000)
        `, [comp1.rows[0].id_compra, ins1]);
      }
      console.log('✅ Compras creadas.');
    }

    // 13. Pedidos y Ventas
    const pedidoCount = await query('SELECT count(*) FROM pedido');
    const firstCli = (await query('SELECT id_cliente FROM cliente LIMIT 1')).rows[0]?.id_cliente;
    const firstSede = (await query('SELECT id_sede FROM sede LIMIT 1')).rows[0]?.id_sede;
    const firstProd = (await query('SELECT id_producto, precio_venta FROM producto LIMIT 1')).rows[0];

    if (parseInt(pedidoCount.rows[0].count) === 0 && firstCli && firstSede && adminUser && firstProd) {
      const ped1 = await query(`
        INSERT INTO pedido (id_cliente, id_sede, id_usuario, fecha_pedido, fecha_entrega, valor_total, estado, observaciones)
        VALUES ($1, $2, $3, NOW() - INTERVAL '1 day', CURRENT_DATE, 125000, 'Entregado', 'Entrega puntual en sede restaurante')
        RETURNING id_pedido
      `, [firstCli, firstSede, adminUser]);

      if (ped1.rows[0]?.id_pedido) {
        await query(`
          INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
          VALUES ($1, $2, 10, $3, 125000)
        `, [ped1.rows[0].id_pedido, firstProd.id_producto, firstProd.precio_venta]);
      }

      // Venta asociada
      const ven1 = await query(`
        INSERT INTO venta (id_sede, id_cliente, id_usuario, id_pedido, fecha_venta, valor_total, medio_pago, estado)
        VALUES ($1, $2, $3, $4, NOW() - INTERVAL '1 day', 125000, 'Transferencia', 'Pagada')
        RETURNING id_venta
      `, [firstSede, firstCli, adminUser, ped1.rows[0]?.id_pedido]);

      if (ven1.rows[0]?.id_venta) {
        await query(`
          INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
          VALUES ($1, $2, 10, $3, 125000)
        `, [ven1.rows[0].id_venta, firstProd.id_producto, firstProd.precio_venta]);

        // Abono
        await query(`
          INSERT INTO abono (id_cliente, id_venta, fecha_abono, valor_abonado, saldo_pendiente, medio_pago, estado)
          VALUES ($1, $2, CURRENT_DATE, 125000, 0, 'Transferencia', 'Registrado')
        `, [firstCli, ven1.rows[0].id_venta]);
      }

      console.log('✅ Pedidos, ventas y abonos creados.');
    }

    console.log('✨ [Seed]: ¡Base de datos CenArepas sembrada y 100% lista con éxito!');
  } catch (err) {
    console.error('❌ [Seed Error]:', err);
  } finally {
    await pool.end();
  }
}

seed();
