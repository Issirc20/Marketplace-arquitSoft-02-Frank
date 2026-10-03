"use strict";
// =============================================================
// PRUEBAS DEL DOMINIO — SIN ANGULAR
// =============================================================
// Este archivo se compila y se ejecuta con Node y TypeScript
// puro, SIN Angular, SIN navegador y SIN servidor.
//
// Que estas pruebas corran es la demostracion mas contundente
// de que el dominio y los casos de uso no dependen del framework.
// Si alguna capa interna importara Angular, esto NO compilaria.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const producto_modelo_1 = require("../dominio/modelos/producto.modelo");
const carrito_modelo_1 = require("../dominio/modelos/carrito.modelo");
const pedido_modelo_1 = require("../dominio/modelos/pedido.modelo");
const precios_1 = require("../dominio/modelos/precios");
const registrar_compra_caso_uso_1 = require("../aplicacion/registrar-compra.caso-uso");
const agregar_al_carrito_caso_uso_1 = require("../aplicacion/agregar-al-carrito.caso-uso");
const consultar_catalogo_caso_uso_1 = require("../aplicacion/consultar-catalogo.caso-uso");
const repositorio_productos_memoria_1 = require("../infraestructura/repositorio-productos-memoria");
const repositorio_pedidos_memoria_1 = require("../infraestructura/repositorio-pedidos-memoria");
const procesador_pagos_simulado_1 = require("../infraestructura/procesador-pagos-simulado");
const notificador_consola_1 = require("../infraestructura/notificador-consola");
let pasadas = 0;
async function prueba(nombre, fn) {
    try {
        await fn();
        pasadas++;
        console.log(`   OK    ${nombre}`);
    }
    catch (error) {
        console.log(`   FALLO ${nombre}: ${error.message}`);
        process.exitCode = 1;
    }
}
function productoDemo(stock = 10) {
    return new producto_modelo_1.Producto('PR001', 'Alimento 15kg', 'alimento', 'perro', 100, stock, 'S01');
}
async function main() {
    const inicio = Date.now();
    console.log('\n=== PRUEBAS DEL DOMINIO (sin Angular, sin navegador) ===\n');
    console.log('-- Entidad Producto');
    await prueba('un producto con precio cero es invalido', () => {
        assert_1.default.throws(() => new producto_modelo_1.Producto('P1', 'Collar', 'accesorio', 'perro', 0, 5, 'S01'), /mayor que cero/);
    });
    await prueba('no se puede descontar mas stock del disponible', () => {
        const producto = productoDemo(3);
        assert_1.default.throws(() => producto.descontar(5), /Stock insuficiente/);
    });
    await prueba('descontar reduce el stock disponible', () => {
        const producto = productoDemo(10);
        producto.descontar(4);
        assert_1.default.strictEqual(producto.stockDisponible, 6);
    });
    console.log('\n-- Reglas de precio');
    await prueba('el precio al cliente incluye la comision del marketplace', () => {
        assert_1.default.strictEqual((0, precios_1.precioParaElCliente)(100), 110);
    });
    await prueba('el total incluye el IGV', () => {
        assert_1.default.strictEqual((0, precios_1.totalConIgv)(100), 118);
    });
    console.log('\n-- Entidad Carrito');
    await prueba('el carrito vacio no tiene items', () => {
        assert_1.default.strictEqual(carrito_modelo_1.Carrito.vacio().estaVacio(), true);
    });
    await prueba('agregar dos veces el mismo producto acumula la cantidad', () => {
        const producto = productoDemo(10);
        const carrito = carrito_modelo_1.Carrito.vacio().agregar(producto, 2).agregar(producto, 3);
        assert_1.default.strictEqual(carrito.cantidadDeItems, 5);
        assert_1.default.strictEqual(carrito.items.length, 1);
    });
    await prueba('el carrito rechaza mas unidades de las que hay en stock', () => {
        const producto = productoDemo(3);
        assert_1.default.throws(() => carrito_modelo_1.Carrito.vacio().agregar(producto, 5), /Stock insuficiente/);
    });
    await prueba('el total del carrito aplica comision e IGV', () => {
        const carrito = carrito_modelo_1.Carrito.vacio().agregar(productoDemo(10), 2);
        assert_1.default.strictEqual(carrito.calcularSubtotal(), 220);
        assert_1.default.strictEqual(carrito.calcularTotal(), 259.6);
    });
    console.log('\n-- Entidad Pedido');
    await prueba('un pedido no puede crearse vacio', () => {
        assert_1.default.throws(() => pedido_modelo_1.Pedido.crear('C01', [], 100, 'AUT'), /no puede estar vacio/);
    });
    await prueba('un pedido cancelado no puede cancelarse otra vez', () => {
        const carrito = carrito_modelo_1.Carrito.vacio().agregar(productoDemo(), 1);
        const pedido = pedido_modelo_1.Pedido.crear('C01', carrito.items, 118, 'AUT');
        pedido.cancelar();
        assert_1.default.throws(() => pedido.cancelar(), /ya no puede cancelarse/);
    });
    console.log('\n-- Casos de uso');
    await prueba('el catalogo solo muestra productos disponibles', async () => {
        const repositorio = new repositorio_productos_memoria_1.RepositorioProductosMemoria([
            productoDemo(5),
            new producto_modelo_1.Producto('PR002', 'Rascador', 'accesorio', 'gato', 200, 0, 'S02'),
        ]);
        const productos = await new consultar_catalogo_caso_uso_1.ConsultarCatalogoCasoUso(repositorio).ejecutar();
        assert_1.default.strictEqual(productos.length, 1);
        assert_1.default.strictEqual(productos[0].id, 'PR001');
    });
    await prueba('agregar al carrito usa el producto real del repositorio', async () => {
        const repositorio = new repositorio_productos_memoria_1.RepositorioProductosMemoria([productoDemo(10)]);
        const carrito = await new agregar_al_carrito_caso_uso_1.AgregarAlCarritoCasoUso(repositorio).ejecutar({
            carritoActual: carrito_modelo_1.Carrito.vacio(),
            productoId: 'PR001',
            cantidad: 2,
        });
        assert_1.default.strictEqual(carrito.cantidadDeItems, 2);
    });
    await prueba('registrar una compra cobra, descuenta stock y guarda el pedido', async () => {
        const productos = new repositorio_productos_memoria_1.RepositorioProductosMemoria([productoDemo(10)]);
        const pedidos = new repositorio_pedidos_memoria_1.RepositorioPedidosMemoria();
        const casoUso = new registrar_compra_caso_uso_1.RegistrarCompraCasoUso(productos, pedidos, new procesador_pagos_simulado_1.ProcesadorPagosSimulado(), new notificador_consola_1.NotificadorConsola());
        const producto = (await productos.buscarPorId('PR001'));
        const carrito = carrito_modelo_1.Carrito.vacio().agregar(producto, 2);
        const pedido = await casoUso.ejecutar({
            clienteId: 'C01',
            carrito,
            medioPago: '4111111111111111',
        });
        assert_1.default.strictEqual(pedido.total, 259.6);
        assert_1.default.strictEqual(pedido.estadoActual, 'pagado');
        assert_1.default.strictEqual((await productos.buscarPorId('PR001')).stockDisponible, 8);
        assert_1.default.strictEqual((await pedidos.listarPorCliente('C01')).length, 1);
    });
    await prueba('si el pago es rechazado no se registra el pedido', async () => {
        const productos = new repositorio_productos_memoria_1.RepositorioProductosMemoria([productoDemo(10)]);
        const pedidos = new repositorio_pedidos_memoria_1.RepositorioPedidosMemoria();
        const casoUso = new registrar_compra_caso_uso_1.RegistrarCompraCasoUso(productos, pedidos, new procesador_pagos_simulado_1.ProcesadorPagosSimulado(false), new notificador_consola_1.NotificadorConsola());
        const producto = (await productos.buscarPorId('PR001'));
        const carrito = carrito_modelo_1.Carrito.vacio().agregar(producto, 1);
        await assert_1.default.rejects(casoUso.ejecutar({ clienteId: 'C01', carrito, medioPago: '4111111111111111' }), /rechazado/);
        assert_1.default.strictEqual((await pedidos.listarPorCliente('C01')).length, 0);
        // Importante: un pago rechazado NO debe consumir stock.
        assert_1.default.strictEqual((await productos.buscarPorId('PR001')).stockDisponible, 10);
    });
    await prueba('no se puede comprar un carrito vacio', async () => {
        const casoUso = new registrar_compra_caso_uso_1.RegistrarCompraCasoUso(new repositorio_productos_memoria_1.RepositorioProductosMemoria([]), new repositorio_pedidos_memoria_1.RepositorioPedidosMemoria(), new procesador_pagos_simulado_1.ProcesadorPagosSimulado(), new notificador_consola_1.NotificadorConsola());
        await assert_1.default.rejects(casoUso.ejecutar({ clienteId: 'C01', carrito: carrito_modelo_1.Carrito.vacio(), medioPago: '4111111111111111' }), /carrito vacio/);
    });
    console.log(`\n   ${pasadas} pruebas en ${Date.now() - inicio} ms, sin levantar Angular.\n`);
}
main();
