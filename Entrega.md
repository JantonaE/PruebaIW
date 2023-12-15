---
title: Ingeniería Web
subtitle: Examen
author: Jesús Antona Espejo
titlepage: true
titlepage-background: "./Assets/background.pdf"
# titlepage-color: "3C9F53"
# titlepage-rule-color: "000000"
titlepage-text-color: "000000"
toc-own-page: true
toc: true
numbersections: true
toc-title: "Índice"
fontfamily: helvet
header-includes:
  - \renewcommand{\familydefault}{\sfdefault}
---


# Requisitos

Los requisitos de ejecución para ejecutar el servidor y el cliente en local son:
- NVM-windows (si se usa windows), para instalar Node o, en su defecto, instalación manual de
- Node 20.10.0
- Los requisitos de ejecución del servidor, descritos en la anterior entrega.
- Los requisitos de ejecución del cliente, disponibles en el archivo package.json e instalables a través de Node Package Manager con: 

```bash
npm install --force
```

# Tecnologías utilizadas

- Base de datos: **MongoDB**.
- Frontend: **Astro**, también con componentes en *Svelte* y *JavaScript/TypeScript*
- Bibliotecas y APIs: Usamos muchas, pero destacamos
    - [**Tailwind**](https://tailwindcss.com/): Framework de CSS y biblioteca de Astro para aplicar estilo a las páginas de manera sencilla y estandarizada.
    - [**Cloudinary**](https://cloudinary.com/): API externa, con su correspondiente biblioteca de JavaScript, para subir y recuperar imágenes en la nube.
    - [**Auth0**](https://auth0.com/): API externa, con su correspondiente biblioteca de JavaScript, para gestionar los usuarios (registro e inicio de sesión) en la página.
    - [**Leaflet**](https://leafletjs.com/): API externa, con su correspondiente biblioteca de JavaScript, para visualizar mapas y realizar operaciones sobre ellos, como poner marcadores y otro tipo de información.
- Despliegue en la nube: **Vercel**.
    - Se podrá acceder al examen desde los enlaces: (https://examen-iw-jesus-projects-c4cc6b61.vercel.app/) o (https://examen-iw.vercel.app/).

# Instrucciones de instalación

Las instrucciones de instalación están incluidas en el archivo *README.MD* del repositorio. Son las siguientes:

## Aclaraciones

Ejecutar los siguientes comando en la terminal (la de VSCode o la de windows, yendo a la ruta del directorio). Para realizar las siguientes instrucciones, primero hay que seguir las instrucciones de ejecución del server descritas en la anterior entrega.

## Crear el archivo ".env" en la raíz de la carpeta

Este archivo se usará para almacenar las variables de entorno (secretos de la aplicación). No se puede subir a ningún servicio web donde se pueda ver públicamente. Cada desarrollador tiene que crear este archivo y meter los secretos, pero nosotros ya le damos en los scripts del proyecto el archivo .env para mayor facilidad.

## Instalar las dependencias

Las dependencias estarán ya designadas en el archivo *package.json*. Para instalarlas, ejecutamos el comando:

```bash
npm install --force
```

## Ejecutar openapi

Ejecutar el comando de openapi para generar los tipos a partir de los modelos del Server Backend:

```bash
npm run openapi
```

```bash
npm install --save mongodb
```

## Iniciar el servidor

Ya una vez instaladas las dependencias y obtenidos los modelos, podemos iniciar el cliente en local con el comando:

```bash
npm run astro dev
```


## /auth/...

En las páginas cuya ruta comienzan por /auth/, se guardarán rutas auxiliares del cliente relacionadas con el servicio de autenticación. En ellos, básicamente se registrará el sistema de inicio de sesión, creación de cookies de la sesión, la función de callback posterior a la llamada a la API de Auth0,...

# Servicios externos / Datos Abiertos

## Auth0

### Descripción

[**Auth0**](https://auth0.com/) es una API externa, con su correspondiente biblioteca de JavaScript, para gestionar los usuarios (registro e inicio de sesión) en un servicio web. Hay que registrarse en la página de Auth0, y registrar una aplicación para obtener su API Key, y poder empezar a usarlo. Desde el menú de Auth0 podemos hacer un montón de personalizaciones sobre el sistema, desde diseñar el widget de inicio de sesión / registro, hasta especificar unas acciones pre y post login ejecutadas directamente en Auth0, como la validación del email o la contraseña, por ejemplo.


## Leaflet

### Descripción

[**Leaflet**](https://leafletjs.com/) es una API externa, con su correspondiente biblioteca de JavaScript, para visualizar mapas y realizar operaciones sobre ellos, como poner marcadores y otro tipo de información. No utiliza autenticación, y solo requiere que especifiquemos el sistema de Tiles (sistema de mapeado - apariencia del mapa) usado. 

### Endpoints

Endpoint usado = https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

Los parámetros son:
- s: el nombre del sistema de tiles.
- x, y, z: las coordenadas donde se centrará el mapa inicialmente.

## Cloudinary

### Descripción

[**Cloudinary**](https://cloudinary.com/) es una API externa, con su correspondiente biblioteca de JavaScript, para subir y recuperar imágenes en la nube. Podemos especificar diversas opciones, como el tamaño de la imagen a recuperar del servidor. 

### Endpoints

No se usa ningún endpoint en concreto, puesto que todo lo hace la biblioteca de cloudinary. Solo tenemos que configurarla pasándole la API Key y el secreto, y ya la podemos usar. Con *cloudinary.url("url", opciones)* podemos recuperar una imagen del servidor. Con *cloudinary.uploader.upload(file, options, callback)*, podemos subir una imagen al servidor.


## Usar la aplicación

Para usar el servidor, simplemente vamos a la ruta https://examen-iw-jesus-projects-c4cc6b61.vercel.app/ o https://examen-iw.vercel.app/  en nuestro navegador.

