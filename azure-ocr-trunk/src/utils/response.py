from typing import Optional
from pydantic import BaseModel

class SubErrorResponse(BaseModel):
    status: str
    http_status: int
    message: str
    step: str
    
class ErrorResponse(BaseModel):
    detail: dict

def make_response(status: str, http_status: int, message: str, step: Optional[str] = None, extracted_data: Optional[dict] = None):
    return {
        "status": status,
        "http_status": http_status,
        "message": message,
        "step": step,
        "extracted_data": extracted_data
    }