from fastapi import APIRouter

from .Producto import producto
from .Usuario import usuario
BaseRouter = APIRouter()

BaseRouter.include_router(producto)

BaseRouter.include_router(usuario)

