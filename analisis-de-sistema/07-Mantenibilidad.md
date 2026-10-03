# Mantenibilidad y Evolución Modular

En driver arquitectónico agregaremos **DA06 : Mantenibilidad / evolución modular**:

| ID | Driver arquitectónico | Origen | ¿Por qué influye? |
|---|---|---|---|
| DA06 | El sistema debe permitir modificar funcionalidades sin afectar innecesariamente otros módulos. | AC05- Mantenibilidad | Influye en la separación de responsabilidades, modularidad y dependencias internas. |

---

## Definición de Drivers Arquitectónicos y Decisiones

Quedando también definido nuestros drivers arquitectónicos:

| Driver | Problema que plantea | Decisión que responde |
|---|---|---|
| DA01- Escalabilidad | Aumentarán usuarios en campañas | Monolito modular con posibilidad de escalamiento horizontal |
| DA02- Rendimiento | Habrá alta concurrencia | Incorporar caché y optimizar comunicación/procesamiento |
| DA03 -Seguridad | Hay datos sensibles | Autenticación y autorización |
| DA04 - Pago externo | Hay que comunicarse con una pasarela | Integración mediante API y adaptadores |
| DA05 -API REST | Frontend/backend deben comunicarse mediante REST | Separar interfaz y backend mediante API REST |
| DA06 - Mantenibilidad | Cambios no deben afectar otros módulos | Modularidad + Clean Architecture |

---

## Estrategia de Mantenibilidad

Para dar cumplimiento al driver **DA06 (Mantenibilidad)**, se adoptan las siguientes directrices arquitectónicas:

1. **Modularidad:**
   - División del sistema en módulos independientes por dominio funcional (Usuarios, Sellers, Catálogo, Carrito, Pedidos).
   - Reducción del acoplamiento entre módulos a través de interfaces claras y dependencias controladas.

2. **Clean Architecture:**
   - Separación estricta de responsabilidades en capas (Dominio, Casos de Uso/Aplicación, Adaptadores e Infraestructura).
   - Aislamiento de las reglas de negocio frente a librerías externas, frameworks, pasarelas de pago y mecanismos de persistencia.
   - Facilidad para incorporar evoluciones funcionales, refactorizaciones y pruebas unitarias/integración sin propagar efectos secundarios.
