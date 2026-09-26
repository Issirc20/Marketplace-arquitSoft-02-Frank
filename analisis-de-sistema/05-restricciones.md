# Restricciones del Sistema

Identificación de las restricciones técnicas, de negocio y operacionales que condicionan las decisiones de diseño y arquitectura del sistema.

| ID | Restricción | Descripción |
|---|---|---|
| RC01 | Aplicación web | El sistema debe desarrollarse como una aplicación accesible mediante un navegador web. |
| RC02 | Control de versiones | El código fuente debe gestionarse utilizando Git y mantenerse en un repositorio compartido. |
| RC03 | API REST | La comunicación entre el frontend y los servicios del sistema debe realizarse mediante una API REST. |
| RC04 | Pasarela de pago | El sistema debe integrarse con una pasarela de pago externa para procesar las operaciones de pago. |
| RC05 | Servicio de envío | El sistema debe integrarse con un servicio externo de envío para gestionar la información relacionada con la entrega de pedidos. |
| RC06 | Servicio de Facturación | El sistema debe integrarse con un servicio externo de facturación electrónica para la generación y emisión de comprobantes de pago. |
| RC07 | Integración con ERP | El sistema debe conectarse con el sistema ERP para sincronizar la información del catálogo de productos y el stock disponible. |
| RC08 | Seguridad y Autenticación | La autenticación y autorización de usuarios y servicios deben gestionarse mediante protocolos estándar seguros (por ejemplo, tokens JWT / OAuth 2.0). |
