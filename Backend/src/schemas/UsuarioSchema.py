def UsuarioEntity(item) -> dict:
    return {
        "id" : str(item["_id"]),
        "idUser": str(item["_id"]),
        "usuario" : item["usuario"],
        "nombre" : item["nombre"],
        "apellido1" : item["apellido1"],
        "apellido2" : item["apellido2"],
        "valoracion" : item["valoracion"],
        "esAdmin" : item["esAdmin"]
    }

def UsuarioEntityList(entity) -> list:
    return [UsuarioEntity(item) for item in entity]

def UsuarioFilterEntity(item) -> dict:
    return {
        "id" : str(item["id"]),
        "idUser": item["id"],
        "usuario" : item["usuario"],
        "nombre" : item["nombre"],
        "apellido1" : item["apellido1"],
        "apellido2" : item["apellido2"],
        "valoracion" : item["valoracion"],
        "esAdmin" : item["esAdmin"]
    }

def UsuarioFilterEntityList(entity) -> list:
    return [UsuarioFilterEntity(item) for item in entity]