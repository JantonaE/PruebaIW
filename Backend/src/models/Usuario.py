from typing import Optional
from pydantic import BaseModel

class Usuario(BaseModel):
    _id: str
    idUser: str
    usuario: str 
    nombre: str 
    apellido1: str 
    apellido2: Optional[str] = None 
    valoracion: float #Entre 0.0 y 5.0
    esAdmin: bool 

class UsuarioCreate(BaseModel):
    _id: str
    usuario: str 
    nombre: str 
    apellido1: str 
    apellido2: Optional[str] = None 
    valoracion: float #Entre 0.0 y 5.0
    esAdmin: bool 