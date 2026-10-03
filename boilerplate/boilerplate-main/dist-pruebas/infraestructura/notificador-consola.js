"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificadorConsola = void 0;
class NotificadorConsola {
    async confirmarPedido(clienteId, pedidoId, total) {
        console.log(`[Notificacion] Cliente ${clienteId}: su pedido ${pedidoId} por S/ ${total} fue confirmado.`);
    }
}
exports.NotificadorConsola = NotificadorConsola;
