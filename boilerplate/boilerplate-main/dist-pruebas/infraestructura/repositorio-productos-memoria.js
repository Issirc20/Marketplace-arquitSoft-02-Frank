"use strict";
// =============================================================
// INFRAESTRUCTURA · Adaptador
// =============================================================
// Cumple el contrato RepositorioProductos guardando en memoria.
// La flecha apunta hacia adentro: este archivo importa el contrato
// del dominio, y el dominio no sabe que este archivo existe.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioProductosMemoria = void 0;
const producto_modelo_1 = require("../dominio/modelos/producto.modelo");
const CATALOGO_INICIAL = [
    new producto_modelo_1.Producto('PR001', 'Alimento balanceado adulto 15kg', 'alimento', 'perro', 145.9, 12, 'S01'),
    new producto_modelo_1.Producto('PR002', 'Rascador torre 3 niveles', 'accesorio', 'gato', 219.0, 4, 'S02'),
    new producto_modelo_1.Producto('PR003', 'Shampoo antipulgas 500ml', 'higiene', 'perro', 32.5, 40, 'S01'),
    new producto_modelo_1.Producto('PR004', 'Comedero doble de acero', 'accesorio', 'perro', 48.0, 25, 'S01'),
    new producto_modelo_1.Producto('PR005', 'Arena sanitaria aglomerante 10kg', 'higiene', 'gato', 39.9, 30, 'S02'),
    new producto_modelo_1.Producto('PR006', 'Pelota mordedora resistente', 'juguete', 'perro', 24.5, 18, 'S02'),
];
class RepositorioProductosMemoria {
    productos = new Map();
    constructor(iniciales = CATALOGO_INICIAL) {
        iniciales.forEach((producto) => this.productos.set(producto.id, producto));
    }
    async listar(filtro) {
        let resultado = [...this.productos.values()];
        if (filtro?.mascota) {
            resultado = resultado.filter((p) => p.mascota === filtro.mascota);
        }
        if (filtro?.categoria) {
            resultado = resultado.filter((p) => p.categoria === filtro.categoria);
        }
        return resultado;
    }
    async buscarPorId(id) {
        return this.productos.get(id) ?? null;
    }
    async guardar(producto) {
        this.productos.set(producto.id, producto);
    }
}
exports.RepositorioProductosMemoria = RepositorioProductosMemoria;
