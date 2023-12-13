from datetime import datetime

date_format = '%d/%m/%Y'

def ProductoEntityFilter(item) -> dict:
    return {
        "id": str(item["id"]),
        "idProd": item["id"],
        "vendedor": item["vendedor"],
        "titulo": item["titulo"],
        "descripcion": item["descripcion"],
        "lat": item["lat"],
        "long": item["long"],
        "direccion": item["direccion"],
        "edad": item["edad"],
        "precio": item["precio"],
        "peso": item["peso"],
        "fecha_publicacion": datetime.strptime(item["fecha_publicacion"], date_format).strftime(date_format),
        "fecha_cierre": datetime.strptime(item["fecha_cierre"], date_format).strftime(date_format),
        "pagado": str(item["pagado"]),
        "valorado": str(item["valorado"]),
        "imagenes": item["imagenes"]
    }

def ProductoEntity(item) -> dict:
    return {
        "id": str(item["_id"]),
        "idProd": str(item["_id"]),
        "vendedor": item["vendedor"],
        "titulo": item["titulo"],
        "descripcion": item["descripcion"],
        "lat": item["lat"],
        "long": item["long"],
        "direccion": item["direccion"],
        "edad": item["edad"],
        "precio": item["precio"],
        "peso": item["peso"], # en kilos
        "fecha_publicacion": datetime.strptime(item["fecha_publicacion"], date_format).strftime(date_format),
        "fecha_cierre": datetime.strptime(item["fecha_cierre"], date_format).strftime(date_format),
        "pagado": str(item["pagado"]),
        "valorado": str(item["valorado"]),
        "imagenes": item["imagenes"]
    }

def ProductoEntityList(entity) -> list:
    return [ProductoEntity(item) for item in entity]

def ProductoEntityFilterList(entity) -> list:
    return [ProductoEntityFilter(item) for item in entity]