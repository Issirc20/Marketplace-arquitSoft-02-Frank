"use strict";
// =============================================================
// INFRAESTRUCTURA · Adaptador de pagos para desarrollo y clase
// =============================================================
// Responde al instante, sin credenciales y sin internet.
// Gracias a el se puede demostrar toda la compra en el aula.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcesadorPagosSimulado = void 0;
class ProcesadorPagosSimulado {
    aprobarSiempre;
    constructor(aprobarSiempre = true) {
        this.aprobarSiempre = aprobarSiempre;
    }
    async cobrar(monto, medioPago) {
        if (medioPago.replace(/\s/g, '').length < 12) {
            return {
                aprobado: false,
                codigoAutorizacion: '',
                motivoRechazo: 'numero de tarjeta invalido',
            };
        }
        if (!this.aprobarSiempre) {
            return {
                aprobado: false,
                codigoAutorizacion: '',
                motivoRechazo: 'fondos insuficientes',
            };
        }
        return {
            aprobado: true,
            codigoAutorizacion: 'SIM-' + Math.round(monto * 100),
        };
    }
}
exports.ProcesadorPagosSimulado = ProcesadorPagosSimulado;
