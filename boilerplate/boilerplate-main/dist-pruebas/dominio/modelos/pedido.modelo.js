"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pedido = void 0;
class Pedido {
    id;
    clienteId;
    lineas;
    total;
    autorizacion;
    estado;
    constructor(id, clienteId, lineas, total, autorizacion, estado) {
        this.id = id;
        this.clienteId = clienteId;
        this.lineas = lineas;
        this.total = total;
        this.autorizacion = autorizacion;
        this.estado = estado;
    }
    /** REGLA DE NEGOCIO: un pedido no nace vacio ni sin cliente. */
    static crear(clienteId, lineas, total, autorizacion) {
        if (!clienteId)
            throw new Error('Un pedido debe tener un cliente');
        if (lineas.length === 0)
            throw new Error('Un pedido no puede estar vacio');
        if (total <= 0)
            throw new Error('El total del pedido debe ser mayor que cero');
        const id = 'PED-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        return new Pedido(id, clienteId, lineas, total, autorizacion, 'pagado');
    }
    get estadoActual() {
        return this.estado;
    }
    /** REGLA DE NEGOCIO: un pedido despachado ya no se cancela. */
    puedeCancelarse() {
        return this.estado === 'pagado';
    }
    cancelar() {
        if (!this.puedeCancelarse()) {
            throw new Error(`Un pedido ${this.estado} ya no puede cancelarse`);
        }
        this.estado = 'cancelado';
    }
}
exports.Pedido = Pedido;
