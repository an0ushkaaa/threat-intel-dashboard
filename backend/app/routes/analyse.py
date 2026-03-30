from fastapi import APIRouter
router=APIRouter()
from app.schemas.analyse_schema import analyse_req

@router.post("/analyse")
def analyse(data:analyse_req):
    return{"you_sent":data.input}

