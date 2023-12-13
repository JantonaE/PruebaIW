# Ejecución de desarrollo

## Requisitos

- Python 3.11 o superior
- Pip3

## Instrucciones

Ejecutar los siguientes comando en la terminal (la de VSCode o la de windows, yendo a la ruta del directorio).

### 1. Crear el archivo ".env" en la raíz de la carpeta "Backend" para almacenar los secretos de la aplicación

**IMPORTANTE: NO SUBIR ESTE ARCHIVO ".env" A GITHUB; METERLO EN ".gitignore" !!**

### 2. Llevar la terminal a la carpeta "Backend"

```sh
cd Backend
```

### 3. Crear el entorno virtual

```sh
python -m venv .venv
```

**IMPORTANTE: NO SUBIR LA CARPETA ".venv" A GITHUB; METERLO EN ".gitignore" !!**

### 4. Activar el entorno virtual

```sh
.\.venv\Scripts\Activate.ps1
```

Si da algún error, abrir PowerShell como administrador (fuera de VSCode), y ejecutar el siguiente comando:

```sh
Set-ExecutionPolicy RemoteSigned
```

Tras ejecutarlo, reiniciar VSCode y volver a intentarlo.

Estará bien ejecutado si en la terminal, antes de la ruta, vemos ahora .venv entre paréntesis y usualmente en verde "(.venv)".

### 5. Actualizar pip

```sh
py -m pip install --upgrade pip
```

### 6. Instalar los paquetes necesarios

```sh
pip install -r requirements.txt
```

### 7. Iniciar el servidor

```sh
uvicorn --reload --port 8000 --host 127.0.0.1 src.app:app
```

### 8. Instalar un paquete

Si instaláis un paquete que no estaba en el requirements.txt, hay que meterlo en el archivo con:

```sh
pip freeze > requirements.txt
```

La aplicación estará en http://127.0.0.1:8000 y la documentación de OpenAPI estará en http://127.0.0.1:8000/docs

### DOCKER Backend

## 1. Vamos al Backend y a nuestro entorno virtual

```sh
docker-compose up
```

