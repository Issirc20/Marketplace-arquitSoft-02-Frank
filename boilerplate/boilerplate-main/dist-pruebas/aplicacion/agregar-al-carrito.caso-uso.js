"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgregarAlCarritoCasoUso = void 0;
class AgregarAlCarritoCasoUso {
    repositorioProductos;
    constructor(repositorioProductos) {
        this.repositorioProductos = repositorioProductos;
    }
    async ejecutar(comando) {
        const producto = await this.repositorioProductos.buscarPorId(comando.productoId);
        if (!producto) {
            throw new Error(`Producto no encontrado: ${comando.productoId}`);
        }
        // La validacion de stock la hace el CARRITO, que es quien conoce la regla.
        return comando.carritoActual.agregar(producto, comando.cantidad);
    }
}
exports.AgregarAlCarritoCasoUso = AgregarAlCarritoCasoUso;
