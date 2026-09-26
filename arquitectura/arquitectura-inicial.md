# Arquitectura inicial del sistema

## Diagrama de arquitectura

```mermaid
flowchart TD
%% =========================
%% ACTORES
%% =========================
subgraph ACTORES["ACTORES"]
Cliente["Cliente"]
Seller["Seller"]
Admin["Administrador"]
end
%% =========================
%% PRESENTACIÓN
%% =========================
subgraph PRESENTACION["PRESENTACIÓN"]
Web["Aplicación Web → API REST"]
end
%% =========================
%% LÓGICA DE NEGOCIO
%% =========================
subgraph NEGOCIO["LÓGICA DE NEGOCIO"]
Usuarios["Usuarios"]
Sellers["Sellers"]
Catalogo["Catálogo"]
Carrito["Carrito"]
Pedidos["Pedidos"]
end
%% =========================
%% DATOS
%% =========================
subgraph DATOS["DATOS"]
BD["Base de datos"]
end
%% =========================
%% SISTEMAS EXTERNOS
%% =========================
subgraph EXTERNOS["SISTEMAS EXTERNOS"]
Pago["Pasarela de pago"]
ERP["ERP"]
Envio["Servicio de envío"]
end
%% =========================
%% FLUJO PRINCIPAL
%% =========================
ACTORES --> PRESENTACION
PRESENTACION --> NEGOCIO
NEGOCIO --> DATOS
%% Integraciones
DATOS -->|"integraciones"| EXTERNOS
%% =========================
%% DISTRIBUCIÓN HORIZONTAL
%% =========================
Cliente ~~~ Seller
Seller ~~~ Admin
Usuarios ~~~ Sellers
Sellers ~~~ Catalogo
Catalogo ~~~ Carrito
Carrito ~~~ Pedidos
Pago ~~~ ERP
ERP ~~~ Envio
%% =========================
%% ESTILOS
%% =========================
style ACTORES fill:#222,stroke:#fff,stroke-width:2px,color:#fff
style PRESENTACION fill:#222,stroke:#fff,stroke-width:2px,color:#fff
style NEGOCIO fill:#222,stroke:#fff,stroke-width:2px,color:#fff
style DATOS fill:#222,stroke:#fff,stroke-width:2px,color:#fff
style EXTERNOS fill:#222,stroke:#fff,stroke-width:2px,color:#fff
style Cliente fill:#222,stroke:#fff,color:#fff
style Seller fill:#222,stroke:#fff,color:#fff
style Admin fill:#222,stroke:#fff,color:#fff
style Web fill:#222,stroke:#fff,color:#fff
style Usuarios fill:#222,stroke:#fff,color:#fff
style Sellers fill:#222,stroke:#fff,color:#fff
style Catalogo fill:#222,stroke:#fff,color:#fff
style Carrito fill:#222,stroke:#fff,color:#fff
style Pedidos fill:#222,stroke:#fff,color:#fff
style BD fill:#222,stroke:#fff,color:#fff
style Pago fill:#222,stroke:#fff,color:#fff
style ERP fill:#222,stroke:#fff,color:#fff
style Envio fill:#222,stroke:#fff,color:#fff
```

## Descripción
La arquitectura inicial se organiza en tres capas principales:
- **Presentación:** permite la interacción de los usuarios con el sistema mediante la aplicación web y la API REST.
- **Lógica de negocio:** contiene los principales módulos responsables de las funcionalidades del sistema: catálogo, sellers, usuarios, carrito y pedidos.
- **Datos:** permite almacenar y consultar la información mediante una base de datos relacional (PostgreSQL).

Además, el sistema se integra con servicios externos:
- **Pasarela de pago:** procesamiento de transacciones de compra desde el módulo de pedidos.
- **Servicio de envío:** coordinación de despacho y guías de seguimiento logístico.
- **Sistema ERP:** sincronización corporativa de catálogo e inventario de productos.

---

## Diagrama Interactivo de Arquitectura (Archify)

Se ha integrado el agente **Archify** para generar un diagrama de arquitectura interactivo, responsive y exportable en formato HTML independiente con SVG vectorial.

- **Visor interactivo HTML:** [arquitectura-inicial.html](./arquitectura-inicial.html)
- **Especificación técnica JSON:** [arquitectura-inicial.json](./arquitectura-inicial.json)
- **Reporte de validación visual:** [arquitectura-inicial.visual-check.html](./arquitectura-inicial.visual-check.html)

### Vista previa del diagrama

#### Modo Claro
![Diagrama en modo claro](./arquitectura-inicial.visual-check.1440x900.light.png)

#### Modo Oscuro
![Diagrama en modo oscuro](./arquitectura-inicial.visual-check.1440x900.dark.png)

### Capacidades interactivas disponibles en el visor
1. **Vistas guiadas (*Guided Views*):**
   - **Flujo principal del cliente:** Resalta el recorrido del comprador desde la consulta de catálogo, carrito y checkout hasta el pago.
   - **Gestión de sellers y ERP:** Aísla la operación comercial y sincronización con el ERP empresarial.
   - **Checkout y despacho logístico:** Enfocado en la pasarela de pago y logística de envíos.
2. **Modo Claro / Oscuro dinámico:** Conmutación instantánea de paleta preservando el contraste tipográfico y semántico.
3. **Inspección y trazado de rutas:** Enfoque en componentes individuales con trazado de dependencias entrantes y salientes.
4. **Exportación de alta fidelidad:** Descarga directa en formatos PNG, SVG, WebP y WebM.
5. **Navegación y Zoom:** Pan/Zoom con modos Path, Map y Lens adaptables a cualquier resolución de pantalla.

### Comandos de gestión y validación
```bash
# Validar especificación de arquitectura con perfil showcase (9 controles de calidad)
node .agents/skills/archify/bin/archify.mjs validate architecture arquitectura/arquitectura-inicial.json --quality showcase --json

# Generar y compilar la versión distribuible del visor HTML
node .agents/skills/archify/bin/archify.mjs deliver architecture arquitectura/arquitectura-inicial.json arquitectura/arquitectura-inicial.html --quality showcase --json

# Ejecutar verificación visual en múltiples resoluciones de escritorio
node .agents/skills/archify/bin/archify.mjs visual-check arquitectura/arquitectura-inicial.html --json
```

