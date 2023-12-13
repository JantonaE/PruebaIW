
from typing import Optional
from fastapi import APIRouter, Body, Path,Response

from ..config.db import conn
from ..schemas.ProductoSchema import ProductoEntity, ProductoEntityList, ProductoEntityFilterList
from ..models.Producto import Producto
from bson import ObjectId
from fastapi import Query
from dateutil.relativedelta import relativedelta 
from datetime import datetime
import requests
from ..utils.globalFunctions import compare_dates, actualTimeByCoords, calculate_carbon_price, calculate_distance, search_adress, date_format

producto = APIRouter()

def checkProducto(prod: Producto):
    # Comprobamos que el usuario vendedor existe

    #COMPROBAR USUARIO EXISTE !!!
    
    # Comprobamos que el título no está vacío

    try:
        if len(prod.titulo) <= 0:
            raise Exception("El título no puede estar vacío")
    except Exception as e:
        return str(e)
    
    # Comprobamos que la latitud y longitud son correctas

    try:
        if prod.lat < -90 or prod.lat > 90:
            raise Exception("La latitud debe estar entre -90 y 90")
    except Exception as e:
        return str(e)
    
    try:
        if prod.long < -180 or prod.long > 180:
            raise Exception("La longitud debe estar entre -180 y 180")
    except Exception as e:
        return str(e)
    
    # Comprobamos que el precio es mayor que 0

    try:
        if prod.precio <= 0:
            raise Exception("El precio debe ser mayor que 0")
    except Exception as e:
        return str(e)
    
    # Comprobamos que el peso es mayor que 0

    try:
        if prod.peso <= 0:
            raise Exception("El peso debe ser mayor que 0")
    except Exception as e:
        return str(e)
    
    # Comprobamos que la fecha de publicación es anterior o igual a la fecha actual
    
    try:
        fechapub = datetime.strptime(prod.fecha_publicacion, date_format).strftime(date_format)
        if compare_dates(fechapub, actualTimeByCoords(prod.lat, prod.long)) > 0:
            raise Exception("La fecha de publicación no puede ser posterior a la fecha actual")
    except:
        prod.fecha_publicacion = actualTimeByCoords(prod.lat, prod.long)

    # Comprobamos que la fecha de cierre es posterior a la fecha de publicación

    #try:
        fechacierre = datetime.strptime(prod.fecha_cierre, date_format).strftime(date_format)
        if compare_dates(fechacierre, prod.fecha_publicacion) <= 0:
            raise Exception("La fecha de cierre no puede ser anterior a la fecha de publicación")
    #except:
        #prod.fecha_cierre = (datetime.strptime(actualTimeByCoords(prod.lat, prod.long), date_format) + relativedelta(months=1)).strftime(date_format)
    
    return prod


@producto.get("/Productos/", tags=["Productos"], response_model=list[Producto], description="Devuelve una lista de productos filtrados")
async def find_all_products(
    # Como parámetros de la función van los filtros
    # Estos en el enlace se verán de la forma /Products?search=...&distanciaMin=...&distanciaMax=...etc

    search: str = Query(None, description="Búsqueda en Titulo o Descripcion"), # Para la barra de búsqueda
    distanciaMin: float = Query(None, description="Distancia (mímima): Diferencia de posiciones"),
    distanciaMax: float = Query(None, description="Distancia (máxima): Diferencia de posiciones"),
    userlat: float = Query(None, description="Latitud del usuario"),
    userlong: float = Query(None, description="Longitud del usuario"),
    edad: float = Query(None, description="Edad del usuario"),
    precioMin: float = Query(None, description="Precio (mínimo del rango)"),
    precioMax: float = Query(None, description="Precio (máximo del rango)"),
    fechaPubMin: str = Query(None, description="Fecha de publicación (mínima) - El formato debe ser 'dd/mm/yyyy'"),
    fechaPubMax: str = Query(None, description="Fecha de publicación (máxima) - El formato debe ser 'dd/mm/yyyy'"),
    fechaCierreMin: str = Query(None, description="Fecha de cierre (mínima) - El formato debe ser 'dd/mm/yyyy'"),
    fechaCierreMax: str = Query(None, description="Fecha de cierre (máxima) - El formato debe ser 'dd/mm/yyyy'"),
    # vendedor: Optional[Usuario] = None - cuando esté definido el modelo Usuario
    vendedor: str = Query(None, description="Vendedor del producto"),
    sortedBy: str = Query(None, description="Campo por el que se ordena la lista"),
    desc: bool = Query(False, description="Ordenar por orden descendente")
) -> list[Producto]:
    
    resList = []

    if edad is None and search is None and distanciaMin is None and distanciaMax is None and userlat is None and userlong is None and precioMin is None and precioMax is None and fechaPubMin is None and fechaPubMax is None and vendedor is None and fechaCierreMin is None and fechaCierreMax is None:
        resList = ProductoEntityList(conn.FRONTEND.Producto.find())
    else:
        for item in ProductoEntityList(conn.FRONTEND.Producto.find()):
            ok = True

            if search is not None:
                if not (search.upper() in item["titulo"].upper() or search.upper() in item["descripcion"].upper()):      
                    ok = False

            if userlat is not None and userlong is not None:
                distancia = (calculate_distance(userlat, userlong, item["lat"], item["long"])) # Distancia entre el usuario y el producto
                precio = item["precio"] + calculate_carbon_price(item["peso"], distancia) # Precio base + huella carbono en base a la distancia del usuario al producto

                if distanciaMin is not None:
                    if not (distancia >= distanciaMin):
                        ok = False
            
                if distanciaMax is not None:
                    if not (distancia <= distanciaMax):
                        ok = False

                if precioMin is not None:
                    if not (precio >= precioMin):
                        ok = False

                if precioMax is not None:
                    if not (precio <= precioMax):
                        ok = False

            else:
                if precioMin is not None:
                    if not (item["precio"] >= precioMin):
                        ok = False

                if precioMax is not None:
                    if not (item["precio"] <= precioMax):
                        ok = False
            
            if fechaPubMin is not None:
                if not (compare_dates(item["fecha_publicacion"], fechaPubMin) >= 0):
                    ok = False
            
            if fechaPubMax is not None:
                if not (compare_dates(item["fecha_publicacion"], fechaPubMax) <= 0):
                    ok = False

            if fechaCierreMin is not None:
                if not (compare_dates(item["fecha_cierre"], fechaCierreMin) >= 0):
                    ok = False
            
            if fechaCierreMax is not None:
                if not (compare_dates(item["fecha_cierre"], fechaCierreMax) <= 0):
                    ok = False
            
            if vendedor is not None:
                if not (item["vendedor"] == vendedor):
                    ok = False
            
            if edad is not None:
                if not (item["edad"] == edad):
                    ok = False

            if ok:
                resList.append(item)

    if sortedBy is not None:
            resList.sort(key=lambda x: x[sortedBy], reverse=desc)
    
    # DEBUG - print(resList)
    return ProductoEntityFilterList(resList)


@producto.get("/Productos/{id}", tags=["Productos"], response_model=Producto, description="Devuelve el producto con id pasado por parámetro")
async def find_one_product(id: str = Path(description="Id del producto a buscar")) -> Producto:
    return ProductoEntity(conn.FRONTEND.Producto.find_one({"_id": ObjectId(id)}))

@producto.post("/Productos/", tags=["Productos"], response_model=Producto, description="Crea un producto y lo devuelve")
async def create_producto(prod: Producto) -> Producto:

    p = checkProducto(prod)

    if(type(p) == str):
        return p
    
    prod = p 

    prod.direccion = search_adress(prod.lat,prod.long)
    
    new_prod = dict(prod)
    id = conn.FRONTEND.Producto.insert_one(new_prod).inserted_id

    return ProductoEntity(conn.FRONTEND.Producto.find_one({"_id": id}))
    
@producto.delete("/Productos/{id}", tags=["Productos"], description="Elimina el producto con id pasado por parámetro", status_code=200, response_class=Response)
async def delete_product(id : str = Path(description="Id del producto a eliminar")) -> Response:
    conn.FRONTEND.Producto.find_one_and_delete({"_id": ObjectId(id)})

    return Response(status_code=200)

@producto.put("/Productos/{id}", tags=["Productos"], response_model=Producto, description="Actualiza el producto con id pasado por parámetro y lo devuelve")
async def update_product(id: str = Path(description="Id del producto a actualizar"), 
                         producto: Producto = Body(description="Datos del producto a actualizar")) -> Producto:
    
    p = checkProducto(producto)

    if(type(p) == str):
        return p
    
    producto = p 
    
    conn.FRONTEND.Producto.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(producto)})

    return ProductoEntity(conn.FRONTEND.Producto.find_one({"_id": ObjectId(id)}))


