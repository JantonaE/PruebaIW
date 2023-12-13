# Instrucciones

## 1. Instalar nvm-windows

Instalar nvm desde ![aqui](https://github.com/coreybutler/nvm-windows/releases/tag/1.1.11).

## 2. Usar nvm-windows

Vamos a descargar node y npm a través de nvm. Abrir la cmd y escribir:

```sh
nvm install latest
```

Esto te dirá el número de versión que es la última y se ha instalado en tu equipo. Para activarla:

```sh
nvm use version
```

donde version es el número de version instalada (por ejemplo *20.2.0*).

## 3. Instalar dependencias

Ya desde el vscode, vamos a la carpeta de frontend:

```sh
cd Frontend
```

Instalamos las dependencias con:

```sh
npm install --force
```

## 4. Ejecutar openapi

Ejecutar el comando de openapi para generar los tipos a partir de los modelos del backend:

```bash
npm run openapi
```

## 5. Ejecutar el server

El server se ejecuta con el comando:

```bash
npm run astro dev
```

El server se encontrará en http://localhost:3000/

# Estructura del proyecto

La estructura de carpetas del proyecto es la siguiente:

```
/
├── public/
│   └── ...
├── src/
│   ├── components/
│   │   └── ...
│   ├── layouts/
│   │   └── ...
│   └── pages/
│       └── ...
└── package.json
```

En components van los componentes independientes en cualquier idioma (React/Svelte/Astro...).

En layouts van los templates para generar otras páginas.

En pages van las páginas, y estas son ya las rutas del servidor. Si creamos un archivo *blog.astro*, se accederá a esta página en *http://localhost:3000/blog*.

Astro busca archivos `.astro` o `.md` en la carpeta de `src/pages/`.

Cualquier asset, como las imágenes, se pueden meter en la carpeta `public/`.
