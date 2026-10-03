"use strict";
// =============================================================
// APLICACION · Caso de uso principal
// =============================================================
// Coordina el flujo completo de la compra:
//   verificar stock -> calcular total -> cobrar -> crear pedido
//   -> guardar -> notificar
//
// Observe que NO contiene reglas de negocio: se las pide a las
// entidades. Y no conoce ninguna tecnologia: habla con contratos.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrarCompraCasoUso = void 0;
const pedido_modelo_1 = require("../dominio/modelos/pedido.modelo");
class RegistrarCompraCasoUso {
    repositorioProductos;
    repositorioPedidos;
    procesadorPagos;
    notificadorCliente;
    constructor(repositorioProductos, repositorioPedidos, procesadorPagos, notificadorCliente) {
        this.repositorioProductos = repositorioProductos;
        this.repositorioPedidos = repositorioPedidos;
        this.procesadorPagos = procesadorPagos;
        this.notificadorCliente = notificadorCliente;
    }
    async ejecutar(comando) {
        const { clienteId, carrito, medioPago } = comando;
        // 1. El carrito no puede estar vacio
        if (carrito.estaVacio()) {
            throw new Error('No se puede comprar un carrito vacio');
        }
        // 2. Verificar stock SIN modificarlo.
        // La compra todavía no ha sido aprobada; no debemos descontar stock
        // si el pago termina siendo rechazado. La regla de stock sigue viviendo
        // en Producto, pero la mutación se hace después de aprobar el pago.
        for (const linea of carrito.items) {
            if (!linea.producto.hayStockPara(linea.cantidad)) {
                throw new Error(`Stock insuficiente para ${linea.producto.nombre}`);
            }
        }
        // 3. Calcular el total: la REGLA vive en el carrito y en precios
        const total = carrito.calcularTotal();
        // 4. Cobrar a traves del CONTRATO, sin saber quien lo cumple
        const cobro = await this.procesadorPagos.cobrar(total, medioPago);
        if (!cobro.aprobado) {
            throw new Error(`El pago fue rechazado: ${cobro.motivoRechazo ?? 'sin detalle'}`);
        }
        // 5. El pago fue aprobado: ahora sí se descuenta el stock.
        for (const linea of carrito.items) {
            linea.producto.descontar(linea.cantidad);
        }
        // 6. Crear el pedido: la entidad valida que sea valido
        const pedido = pedido_modelo_1.Pedido.crear(clienteId, carrito.items, total, cobro.codigoAutorizacion);
        // 7. Persistir a traves de los CONTRATOS
        for (const linea of carrito.items) {
            await this.repositorioProductos.guardar(linea.producto);
        }
        await this.repositorioPedidos.guardar(pedido);
        // 8. Notificar a traves del CONTRATO
        await this.notificadorCliente.confirmarPedido(clienteId, pedido.id, total);
        return pedido;
    }
}
exports.RegistrarCompraCasoUso = RegistrarCompraCasoUso;
