"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioPedidosMemoria = void 0;
class RepositorioPedidosMemoria {
    pedidos = new Map();
    async guardar(pedido) {
        this.pedidos.set(pedido.id, pedido);
    }
    async buscarPorId(id) {
        return this.pedidos.get(id) ?? null;
    }
    async listarPorCliente(clienteId) {
        return [...this.pedidos.values()].filter((p) => p.clienteId === clienteId);
    }
}
exports.RepositorioPedidosMemoria = RepositorioPedidosMemoria;
