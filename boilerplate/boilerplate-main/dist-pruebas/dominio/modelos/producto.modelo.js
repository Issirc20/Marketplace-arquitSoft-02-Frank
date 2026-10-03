"use strict";
// =============================================================
// DOMINIO · Entidad Producto
// =============================================================
// Sin Angular, sin HttpClient, sin base de datos.
// Contiene reglas que serian verdad aunque el marketplace
// funcionara con cuaderno y lapicero.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = exports.CATEGORIAS_PERMITIDAS = void 0;
exports.CATEGORIAS_PERMITIDAS = [
    'alimento', 'higiene', 'juguete', 'accesorio', 'salud',
];
class Producto {
    id;
    nombre;
    categoria;
    mascota;
    precioBase;
    stock;
    sellerId;
    constructor(id, nombre, categoria, mascota, precioBase, stock, sellerId) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.mascota = mascota;
        this.precioBase = precioBase;
        this.stock = stock;
        this.sellerId = sellerId;
        if (!nombre || nombre.trim().length < 3) {
            throw new Error('El nombre del producto debe tener al menos 3 caracteres');
        }
        if (!exports.CATEGORIAS_PERMITIDAS.includes(categoria)) {
            throw new Error(`Categoria no permitida: ${categoria}`);
        }
        if (precioBase <= 0) {
            throw new Error('El precio debe ser mayor que cero');
        }
        if (!Number.isInteger(stock) || stock < 0) {
            throw new Error('El stock debe ser un entero mayor o igual a cero');
        }
        if (!sellerId) {
            throw new Error('Todo producto debe tener un seller responsable');
        }
    }
    get stockDisponible() {
        return this.stock;
    }
    estaDisponible() {
        return this.stock > 0;
    }
    /** REGLA DE NEGOCIO: solo se puede comprar si alcanza el stock. */
    hayStockPara(cantidad) {
        return cantidad > 0 && this.stock >= cantidad;
    }
    /** REGLA DE NEGOCIO: descontar valida antes de modificar. */
    descontar(cantidad) {
        if (!this.hayStockPara(cantidad)) {
            throw new Error(`Stock insuficiente para ${this.nombre}`);
        }
        this.stock -= cantidad;
    }
}
exports.Producto = Producto;
