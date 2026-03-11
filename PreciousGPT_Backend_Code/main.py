# main.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api.p1_router import router as p1_router
from api.p2_router import router as p2_router
from api.p3_router import router as p3_router
from api.health_router import router as health_router
from api.auth_router import router as auth_router
from api.project_router import router as project_router
from api.experiment_router import router as experiment_router
from config import settings
from utils.logger import get_logger
from database import connect_to_mongo, close_mongo_connection

logger = get_logger(__name__)

# Log all requests for debugging
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("PreciousGPT backend starting", model=settings.default_model)
    await connect_to_mongo()
    yield
    await close_mongo_connection()
    logger.info("PreciousGPT backend shutting down")



app = FastAPI(
    title="PreciousGPT API",
    description="Computational Biology AI Platform — Simulation Backend",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    logger.info("Request received", path=request.url.path, method=request.method,
                origin=request.headers.get("origin"))
    response = await call_next(request)
    return response


app.include_router(health_router, prefix="/api", tags=["Health"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(project_router, prefix="/api/projects", tags=["Projects"])
app.include_router(experiment_router, prefix="/api/experiments", tags=["Experiments History"])
app.include_router(p1_router, prefix="/api/p1", tags=["Precious1GPT"])
app.include_router(p2_router, prefix="/api/p2", tags=["Precious2GPT"])
app.include_router(p3_router, prefix="/api/p3", tags=["Precious3GPT"])

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "detail": exc.errors(),
            "message": "Request parameters are invalid. Check field types and required values."
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception", path=request.url.path, error=str(exc))
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. The experiment could not be completed."
        }
    )
