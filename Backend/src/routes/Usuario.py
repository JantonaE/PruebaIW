from fastapi import APIRouter, Body, Path,Response, Query
from ..schemas.ProductoSchema import ProductoEntityList
from ..config.db import conn
from ..schemas.UsuarioSchema import UsuarioEntity, UsuarioEntityList, UsuarioFilterEntityList
from ..models.Usuario import Usuario, UsuarioCreate
from bson import ObjectId

usuario = APIRouter()

def checkUser(user:Usuario):

    # Comprobamos que el nombre de usuario no exista ya

    query = {}
    query["usuario"] = user.usuario

    try:
        if conn.FRONTEND.Usuario.find_one(query):
            raise Exception("El nombre de usuario ya existe")
    except Exception as e:
        return str(e)

    # Comprobamos que el nombre no esté vacío

    try:
        if user.nombre == "":
            raise Exception("El nombre no puede estar vacío")
    except Exception as e:
        return str(e)
    
    # Comprobamos que el apellido 1 no esté vacío

    try:
        if user.apellido1 == "":
            raise Exception("El apellido no puede estar vacío")
    except Exception as e:
        return str(e)
    
    # Comprobamos que la valoración esté entre 0 y 5

    try:
        if user.valoracion < 0 or user.valoracion > 5:
            raise Exception("La valoración debe estar entre 0 y 5")
    except Exception as e:
        return str(e)
    
    return user

@usuario.get("/Usuarios/", tags=["Usuarios"], response_model=list[Usuario], description="Devuelve una lista de usuarios filtrados")
async def find_all_users(
    # Como parámetros de la función van los filtros
    # Estos en el enlace se verán de la forma /Users?search=...

    letraNombre: str = Query(None, description="Primera letra del nombre"),
    letraApellido: str = Query(None, description="Primera letra del apellido"),
    valoracion: float = Query(None, description="Valoracion del usuario"),
    esAdmin: bool = Query(None, description="Rol del usuario")
) -> list[Usuario]:
    
    resList = []

    if letraNombre is None and letraApellido is None and valoracion is None and esAdmin is None:
        resList = UsuarioEntityList(conn.FRONTEND.Usuario.find())
    else:
        for item in UsuarioEntityList(conn.FRONTEND.Usuario.find()):
            ok = True

            if esAdmin is not None:
                if esAdmin == True:
                    if not (item["esAdmin"] == True):
                        ok = False  
                else:
                    if not (item["esAdmin"] == False):
                        ok = False
                

            if valoracion is not None:
                if not (item["valoracion"] >= valoracion):
                    ok = False

            if letraNombre is not None:
                if not (str(item["nombre"])[0].upper() == letraNombre.upper()):
                    ok = False

            if letraApellido is not None:
                if not (str(item["nombre"])[0].upper() == letraApellido.upper()):
                    ok = False

            if ok:
                resList.append(item)
    
    # DEBUG - print(resList)
    return UsuarioFilterEntityList(resList)

@usuario.get("/Usuarios/{id}", tags=["Usuarios"], response_model=Usuario, description="Devuelve el usuario con id pasado por parámetro")
async def find_one_user(id: str = Path(description="Id del usuario a buscar")) -> Usuario:
    return UsuarioEntity(conn.FRONTEND.Usuario.find_one({"_id": ObjectId(id)}))

@usuario.post("/Usuarios/", tags=["Usuarios"], response_model=Usuario, description="Crea un Usuario y lo devuelve")
async def create_user(user: UsuarioCreate) -> Usuario:

    us = Usuario(idUser='', usuario=user.usuario, nombre=user.nombre, apellido1=user.apellido1, apellido2=user.apellido2, valoracion=user.valoracion, esAdmin=user.esAdmin )
    print(us)
    u = checkUser(us)

    if(type(u) == str):
        return u

    user.usuario = u.usuario
    user.nombre = u.nombre
    user.apellido1 = u.apellido1
    user.apellido2 = u.apellido2
    user.valoracion = u.valoracion
    user.esAdmin = u.esAdmin

    new_user = dict(user)
    print(new_user)
    id = conn.FRONTEND.Usuario.insert_one(new_user).inserted_id
    return UsuarioEntity(conn.FRONTEND.Usuario.find_one({"_id": ObjectId(id)}))

@usuario.delete("/Usuarios/{id}", tags=["Usuarios"], description="Elimina el usuario con id pasado por parámetro", status_code=200, response_class=Response)
async def delete_user(id : str = Path(description="Id del usuario a eliminar")) -> Response:
    conn.FRONTEND.Usuario.find_one_and_delete({"_id": ObjectId(id)})
    return Response(status_code=200)

@usuario.put("/Usuarios/{id}", tags=["Usuarios"], response_model=Usuario, description="Actualiza el usuario con id pasado por parámetro y lo devuelve")
async def update_user(id: str = Path(description="Id del usuario a actualizar"), 
                         user: Usuario = Body(description="Datos del usuario a actualizar")) -> Usuario:
    
    #u = checkUser(user)

    #if(type(u) == str):
    #   return u
    
    #user = u
    #user = u

    conn.FRONTEND.Usuario.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(user)})

    return UsuarioEntity(conn.FRONTEND.Usuario.find_one({"_id": ObjectId(id)}))

@usuario.get("/Usuarios/Username/{username}", tags=["Usuarios"], response_model=Usuario, description="Devuelve el usuario con username pasado por parámetro")
async def find_User_By_Username(username: str = Path(description="Usuario del usuario a buscar")) -> Usuario:
    return UsuarioEntity(conn.FRONTEND.Usuario.find_one({
        "usuario": {
            "$regex": username,
            "$options": "i"
        }
        }))

