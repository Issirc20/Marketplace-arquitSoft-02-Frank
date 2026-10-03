"use strict";
// =============================================================
// APLICACION · Caso de uso
// =============================================================
// Lea las importaciones: solo cosas del dominio.
// No aparece Angular, ni HttpClient, ni ninguna tecnologia.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultarCatalogoCasoUso = void 0;
class ConsultarCatalogoCasoUso {
    repositorioProductos;
    constructor(repositorioProductos) {
        this.repositorioProductos = repositorioProductos;
    }
    async ejecutar(filtro) {
        const productos = await this.repositorioProductos.listar(filtro);
        // REGLA DE NEGOCIO: el catalogo solo muestra productos disponibles.
        return productos.filter((producto) => producto.estaDisponible());
    }
}
exports.ConsultarCatalogoCasoUso = ConsultarCatalogoCasoUso;
