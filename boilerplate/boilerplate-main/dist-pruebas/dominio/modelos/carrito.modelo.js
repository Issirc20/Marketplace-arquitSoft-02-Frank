"use strict";
// =============================================================
// DOMINIO · Entidad Carrito
// =============================================================
// El carrito es inmutable: agregar o quitar devuelve un carrito
// nuevo. Asi la interfaz nunca puede dejarlo en un estado invalido.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carrito = void 0;
const precios_1 = require("./precios");
class Carrito {
    lineas;
    constructor(lineas) {
        this.lineas = lineas;
    }
    static vacio() {
        return new Carrito([]);
    }
    get items() {
        return this.lineas;
    }
    get cantidadDeItems() {
        return this.lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
    }
    estaVacio() {
        return this.lineas.length === 0;
    }
    /** REGLA DE NEGOCIO: no se puede agregar mas de lo que hay en stock. */
    agregar(producto, cantidad) {
        if (cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor que cero');
        }
        const existente = this.lineas.find((l) => l.producto.id === producto.id);
        const cantidadFinal = (existente?.cantidad ?? 0) + cantidad;
        if (!producto.hayStockPara(cantidadFinal)) {
            throw new Error(`Stock insuficiente para ${producto.nombre}`);
        }
        const nuevas = existente
            ? this.lineas.map((l) => l.producto.id === producto.id ? { producto, cantidad: cantidadFinal } : l)
            : [...this.lineas, { producto, cantidad }];
        return new Carrito(nuevas);
    }
    quitar(productoId) {
        return new Carrito(this.lineas.filter((l) => l.producto.id !== productoId));
    }
    vaciar() {
        return Carrito.vacio();
    }
    /** Precio unitario que paga el cliente por una unidad. */
    precioUnitario(producto) {
        return (0, precios_1.precioParaElCliente)(producto.precioBase);
    }
    /** Importe de una linea del carrito, según la regla de precios del dominio. */
    importeLinea(linea) {
        return (0, precios_1.redondear)(this.precioUnitario(linea.producto) * linea.cantidad);
    }
    /** Subtotal: suma de los precios al cliente, con la comision incluida. */
    calcularSubtotal() {
        const suma = this.lineas.reduce((total, linea) => total + this.importeLinea(linea), 0);
        return (0, precios_1.redondear)(suma);
    }
    calcularTotal() {
        return (0, precios_1.totalConIgv)(this.calcularSubtotal());
    }
}
exports.Carrito = Carrito;
