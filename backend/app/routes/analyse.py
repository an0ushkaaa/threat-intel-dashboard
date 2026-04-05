from fastapi import APIRouter
router=APIRouter()
from app.schemas.analyse_schema import analyse_req
from app.services.analyse_services import detect_type

@router.post("/analyse")
def analyse(data:analyse_req):
    result=detect_type(data.input)
    return{
        "input":data.input,
        "type":result
    }
    


