from typing import Optional
from pydantic import BaseModel
    

class Producto(BaseModel):
    _id: str
    # vendedor: Usuario esta se usa cuando ya haya un objeto Usuario con su modelo y esquema. Mientras tanto pongo un id int generico
    idProd: str
    vendedor: str
    # Coordenadas (Direccion)
    titulo: str
    descripcion: str
    lat: float
    long: float
    direccion: str
    edad: Optional[float]
    precio: float
    peso: float # en kilos
    fecha_publicacion: str # FORMATO: string de la forma "dd/mm/yyyy"
    fecha_cierre: str
    pagado: bool
    valorado: bool
    # Imagenes
    imagenes: Optional[list[str]] = None

