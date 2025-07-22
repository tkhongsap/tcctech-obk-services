import logging
import asyncio
import uvicorn
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from src.utils.response import ErrorResponse, SubErrorResponse
from src.route.routes import router
from src.config.config import load_config
from fastapi.exceptions import HTTPException as FastAPIHTTPException

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(),
    ],
)
logger = logging.getLogger(__name__)

config = load_config()
config.is_any_attributes_null(logger=logger)
app_config = config.app_config()
REQUEST_TIMEOUT_ERROR = int(app_config["REQUEST_TIMEOUT_ERROR"])

app = FastAPI()


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {str(exc)}", exc_info=True)

    if isinstance(exc, FastAPIHTTPException):
        if exc.status_code == 408:
            return JSONResponse(status_code=exc.status_code, content=exc.detail)

    sub_error_response = SubErrorResponse(
        status=str(exc),
        http_status=500,
        message="An unexpected error occurred",
        step=str(exc),
    )

    error_response = ErrorResponse(detail=sub_error_response.model_dump())

    return JSONResponse(status_code=500, content=error_response.model_dump())


@app.middleware("http")
async def timeout_middleware(request: Request, call_next):
    try:
        return await asyncio.wait_for(call_next(request), timeout=REQUEST_TIMEOUT_ERROR)

    except asyncio.TimeoutError:
        detail = {
            "detail": {
                "status": "timeout error",
                "http_status": 408,
                "message": "the ocr processes has been timeout",
                "step": "timeout error",
            }
        }
        raise HTTPException(status_code=408, detail=detail)


app.add_middleware(BaseHTTPMiddleware, dispatch=timeout_middleware)

app.include_router(router)

if __name__ == "__main__":
    # for debug
    uvicorn.run("main:app", port=8000, loop="asyncio")
