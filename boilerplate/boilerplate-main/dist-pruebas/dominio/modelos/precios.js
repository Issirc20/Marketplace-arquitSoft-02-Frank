"use strict";
// =============================================================
// DOMINIO · Reglas de precio del marketplace
// =============================================================
// Este archivo NO importa nada de Angular ni de ninguna libreria.
// La comision y el IGV son decisiones del NEGOCIO, no calculos
// auxiliares, y por eso viven aqui y en un solo lugar.
Object.defineProperty(exports, "__esModule", { value: true });
exports.IGV = exports.COMISION_MARKETPLACE = void 0;
exports.precioParaElCliente = precioParaElCliente;
exports.calcularIgv = calcularIgv;
exports.totalConIgv = totalConIgv;
exports.redondear = redondear;
exports.COMISION_MARKETPLACE = 0.10;
exports.IGV = 0.18;
/** Precio que ve el cliente: el precio del seller mas la comision. */
function precioParaElCliente(precioBase) {
    return redondear(precioBase * (1 + exports.COMISION_MARKETPLACE));
}
/** Monto del IGV sobre un subtotal. */
function calcularIgv(subtotal) {
    return redondear(subtotal * exports.IGV);
}
/** Total final que se cobra. */
function totalConIgv(subtotal) {
    return redondear(subtotal * (1 + exports.IGV));
}
function redondear(monto) {
    return Math.round(monto * 100) / 100;
}
