from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import FileResponse
from .routes import BaseRouter

__name__='Jesus Antona'
__version__='0.1.0'
__docs__='Ingeniería Web'

###############################################################################
#   Application object                                                        #
###############################################################################

app = FastAPI()

favicon_path = 'favicon.ico'

@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse(favicon_path)

# Origins allowed to fetch api: for local dev purposes
origins = [
    "http://127.0.0.1.tiangolo.com",
    "https://127.0.0.1.tiangolo.com",
    "http://localhost",
    "http://localhost:4321",
]

###############################################################################
#   Routers and Middleware configuration                                      #
###############################################################################

app.include_router(BaseRouter)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

###############################################################################
#   Create custom Openapi                                                     #
###############################################################################

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=__name__,
        version=__version__,
        description=__docs__,
        routes=app.routes,
        openapi_version='3.0.0',
    )

    # Include servers section
    openapi_schema["servers"] = [
        {"url": "/", "description": "Default"},
        {"url": "http://localhost:8000", "description": "Local dev"}
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

###############################################################################
#   Write Openapi.json to file                                                #
###############################################################################

from pathlib import Path
import json

dirname = Path(__file__).resolve().parent
with open(dirname / "../openapi.json", 'w') as f:
    res = app.openapi()
    f.write(json.dumps(res, indent=2))