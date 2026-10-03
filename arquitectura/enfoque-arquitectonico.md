# Enfoque Arquitectónico: Clean Architecture

Este documento define el patrón y enfoque arquitectónico adoptado para la aplicación cliente del marketplace (**Marketplace Web** en Angular 18 con TypeScript), estableciendo el control de dependencias internas mediante **Clean Architecture (Arquitectura Limpia)**.

---

## 1. Definición del Patrón / Enfoque Arquitectónico

| Elemento | Descripción aplicada al Marketplace |
|---|---|
| **Patrón / enfoque arquitectónico** | Clean Architecture (Arquitectura Limpia). |
| **Objetivo** | Separar responsabilidades y controlar las dependencias hacia el dominio. |
| **¿Qué problema resuelve?** | Evita el acoplamiento entre la interfaz Angular, las reglas del negocio y las tecnologías externas, como bases de datos, API y servicios de pago. |
| **Capas definidas** | Presentación, Aplicación, Dominio e Infraestructura. |
| **Beneficios** | • Facilita el mantenimiento y las pruebas unitarias.<br/>• Permite cambiar implementaciones técnicas sin modificar innecesariamente las reglas del negocio.<br/>• Mejora la organización y separación de responsabilidades del código. |

---

## 2. Diagrama de Clean Architecture en Marketplace Web

El siguiente diagrama detalla la organización concéntrica en capas, el flujo de ejecución, la inversión de dependencias y la integración externa con el backend monolítico modular:

```mermaid
flowchart TD
%% ==========================================
%% ACTOR
%% ==========================================
subgraph ACTOR["Actor"]
    User["Usuario<br/><i>(Cliente)</i>"]
end

%% ==========================================
%% APLICACIÓN ANGULAR
%% ==========================================
subgraph APP["«aplicación» Marketplace Web [Angular 18 · TypeScript]  src/app/"]

    subgraph ADAPTADORES["ADAPTADORES Y FRAMEWORKS — dependen de Angular, HttpClient, RxJS"]

        %% ----------------------------------
        %% PRESENTACIÓN
        %% ----------------------------------
        subgraph PRESENTACION["PRESENTACIÓN<br/><i>src/app/presentacion/</i>"]
            CatalogoComp["«componente»<br/><b>CatalogoComponent</b><br/>lista y filtra productos"]
            EstadoCarrito["«servicio de estado»<br/><b>EstadoCarrito</b><br/>signals · sin reglas"]
            CarritoComp["«componente»<br/><b>CarritoComponent</b><br/>resumen y confirmar compra"]
            AppComp["«componente»<br/><b>AppComponent</b><br/>shell de la aplicación"]
        end

        %% ----------------------------------
        %% APLICACIÓN (Casos de uso)
        %% ----------------------------------
        subgraph APLICACION["APLICACIÓN — casos de uso<br/><i>src/app/aplicacion/</i>"]
            CasoCat["«caso de uso»<br/><b>ConsultarCatalogoCasoUso</b><br/>ejecutar()"]
            CasoAddCarr["«caso de uso»<br/><b>AgregarAlCarritoCasoUso</b><br/>ejecutar()"]
            CasoRegCompra["«caso de uso»<br/><b>RegistrarCompraCasoUso</b><br/>ejecutar()"]
        end

        %% ----------------------------------
        %% DOMINIO (Núcleo)
        %% ----------------------------------
        subgraph DOMINIO["DOMINIO — núcleo  src/app/dominio/<br/><i>TypeScript puro: sin imports de Angular, HttpClient ni RxJS.<br/>Se verifica sin navegador con npm run pruebas.</i>"]
            
            subgraph Modelos["Modelos (entidades y reglas)"]
                Prod["«entidad»<br/><b>Producto</b><br/>stock, categoría, precio"]
                Carr["«entidad»<br/><b>Carrito</b><br/>inmutable · subtotal, total"]
                Ped["«entidad»<br/><b>Pedido</b><br/>estados · cancelación"]
                Precios["«reglas»<br/><b>precios.ts</b><br/>comisión 10% - IGV 18%"]
            end

            subgraph Contratos["Contratos (puertos)"]
                IRepoProd["«interface»<br/><b>RepositorioProductos</b>"]
                IRepoPed["«interface»<br/><b>RepositorioPedidos</b>"]
                IProcPagos["«interface»<br/><b>ProcesadorPagos</b>"]
                INotif["«interface»<br/><b>NotificadorCliente</b>"]
            end
        end

        %% ----------------------------------
        %% INFRAESTRUCTURA
        %% ----------------------------------
        subgraph INFRAESTRUCTURA["INFRAESTRUCTURA<br/><i>src/app/infraestructura/</i>"]
            AdapRepoProd["«adaptador»<br/><b>RepositorioProductosMemoria</b><br/><b>RepositorioProductosHttp</b>"]
            AdapRepoPed["«adaptador»<br/><b>RepositorioPedidosMemoria</b>"]
            AdapProcPagos["«adaptador»<br/><b>ProcesadorPagosSimulado</b><br/><b>ProcesadorPagosNiubiz</b>"]
            AdapNotif["«adaptador»<br/><b>NotificadorConsola</b><br/><b>NotificadorWhatsApp</b>"]
            TokensDI["«Angular DI»<br/><b>tokens.ts</b><br/>InjectionToken por contrato"]
        end

    end

    %% ----------------------------------
    %% RAÍZ DE COMPOSICIÓN
    %% ----------------------------------
    RaizComp["«raíz de composición»<br/><b>app.config.ts</b><br/>único archivo que elige qué adaptador cumple cada contrato (useFactory + InjectionToken) y lo inyecta en los casos de uso"]

    TokensDI -.->|registra| RaizComp

end

%% ==========================================
%% SISTEMA EXTERNO (BACKEND)
%% ==========================================
subgraph BACKEND["«sistema externo»<br/><b>Marketplace API REST</b><br/>Backend Node.js · monolito modular"]
    API["/api/productos<br/>/api/pedidos<br/>/api/authorization<br/>/api/mensajes<br/><br/><i>Se integra con Niubiz y WhatsApp;<br/>las credenciales viven solo aquí.</i>"]
end

%% ==========================================
%% RELACIONES Y FLUJO
%% ==========================================
User -->|navegador| PRESENTACION

CatalogoComp -->|invoca| CasoCat
CarritoComp -->|invoca| CasoAddCarr
CarritoComp -->|invoca| CasoRegCompra

EstadoCarrito -.->|depende de| Carr

CasoCat -->|usa| IRepoProd
CasoCat -->|usa| Prod
CasoAddCarr -->|usa| Carr
CasoAddCarr -->|usa| Prod
CasoRegCompra -->|usa| IRepoPed
CasoRegCompra -->|usa| IProcPagos
CasoRegCompra -->|usa| INotif
CasoRegCompra -->|usa| Ped
CasoRegCompra -->|usa| Precios

%% Inversión de dependencias (Implementación de contratos)
AdapRepoProd -.->|implementa| IRepoProd
AdapRepoPed -.->|implementa| IRepoPed
AdapProcPagos -.->|implementa| IProcPagos
AdapNotif -.->|implementa| INotif

%% Comunicación HTTP hacia Backend
AdapRepoProd -->|HTTP / JSON| API
AdapProcPagos -->|HTTP / JSON| API
AdapNotif -->|HTTP / JSON| API
```

---

## 3. Descripción de las Capas de la Arquitectura

### 3.1. Capa de Dominio (`src/app/dominio/`)
Es el **núcleo central del sistema** y contiene la lógica de negocio pura:
- **TypeScript puro e independiente:** No posee dependencias de Angular, `@angular/core`, `HttpClient`, ni `RxJS`. Esto permite que todas las reglas de negocio puedan ser validadas y probadas en milisegundos sin requerir un navegador (`npm run pruebas`).
- **Modelos y Entidades:**
  - `Producto`: Atributos de producto, stock disponible, categoría y precios.
  - `Carrito`: Modelo inmutable para cálculo de subtotal y total.
  - `Pedido`: Ciclo de vida del pedido, estados y reglas de cancelación.
  - `precios.ts`: Funciones puras con las políticas de precios (comisión del marketplace del 10% e IGV del 18%).
- **Contratos (Puertos):** Interfaces de TypeScript que definen los métodos requeridos sin conocer la implementación:
  - `RepositorioProductos`
  - `RepositorioPedidos`
  - `ProcesadorPagos`
  - `NotificadorCliente`

### 3.2. Capa de Aplicación (`src/app/aplicacion/`)
Orquesta los flujos de casos de uso del sistema coordinando las entidades del dominio y los contratos definidos:
- `ConsultarCatalogoCasoUso`: Filtra y recupera productos mediante el contrato `RepositorioProductos`.
- `AgregarAlCarritoCasoUso`: Aplica validaciones de stock y añade productos al estado del carrito.
- `RegistrarCompraCasoUso`: Ejecuta el flujo completo de checkout (creación de pedido, procesamiento de pago con `ProcesadorPagos` y envío de confirmación con `NotificadorCliente`).

### 3.3. Capa de Presentación (`src/app/presentacion/`)
Responsable exclusivamente de la interfaz de usuario en Angular 18:
- `CatalogoComponent`: Vista de listado, búsqueda y filtrado de productos.
- `CarritoComponent`: Resumen visual de ítems seleccionados y botón de confirmación de compra.
- `EstadoCarrito`: Servicio reactivo basado en Angular **Signals** para gestión de estado en memoria del carrito (sin reglas de negocio).
- `AppComponent`: Shell principal contenedor de la aplicación.

### 3.4. Capa de Infraestructura (`src/app/infraestructura/`)
Implementa los puertos/contratos del dominio mediante adaptadores tecnológicos concretos:
- **Adaptadores de Repositorio:**
  - `RepositorioProductosHttp` / `RepositorioPedidosHttp`: Consumo de la API REST externa vía `HttpClient`.
  - `RepositorioProductosMemoria` / `RepositorioPedidosMemoria`: Implementaciones en memoria para desarrollo local rápido y pruebas automatizadas offline.
- **Adaptadores de Pagos y Notificaciones:**
  - `ProcesadorPagosSimulado` y `ProcesadorPagosNiubiz`.
  - `NotificadorConsola` y `NotificadorWhatsApp`.
- **Inyección de Dependencias:**
  - `tokens.ts`: Define los `InjectionToken` correspondientes a cada interfaz/contrato para permitir la inversión de control en Angular.

### 3.5. Raíz de Composición (`app.config.ts`)
Es el **único punto de la aplicación** donde se realiza el acoplamiento técnico:
- Utiliza proveedores con `useFactory` vinculando cada `InjectionToken` con su adaptador correspondiente (por ejemplo, alternar entre `RepositorioProductosHttp` o `RepositorioProductosMemoria`).
- Permite cambiar completamente la infraestructura técnica o simular servicios de terceros sin alterar una sola línea del dominio ni de los casos de uso.

### 3.6. Sistema Externo: Backend Marketplace API REST
Monolito modular Node.js que expone los servicios a través de HTTPS/JSON:
- Endpoints: `/api/productos`, `/api/pedidos`, `/api/authorization`, `/api/mensajes`.
- La pasarela de pagos oficial (Niubiz) y el gateway de mensajería (WhatsApp) viven detrás de esta API para mantener seguras las credenciales y llaves privadas.

---

## 4. Reglas de Dependencia

1. **Aislamiento absoluto del dominio:** El dominio no importa nada de las capas externas (ni de Aplicación, ni de Presentación, ni de Infraestructura, ni de librerías del framework).
2. **Conocimiento restringido en Casos de Uso:** Los casos de uso solo conocen entidades de dominio y contratos (interfaces), nunca implementaciones concretas.
3. **Intercambiabilidad de adaptadores:** Los adaptadores implementan contratos; por lo tanto, pueden ser sustituidos en cualquier momento sin riesgo de regresión funcional.
4. **Cambio tecnológico localizado:** Cambiar de tecnología o proveedor externo consiste únicamente en actualizar `app.config.ts` y proveer un nuevo adaptador en infraestructura, sin modificar el código de negocio.
