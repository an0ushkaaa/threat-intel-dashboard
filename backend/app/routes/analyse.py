from fastapi import APIRouter
router=APIRouter()
from app.schemas.analyse_schema import analyse_req
from app.services.analyse_services import detect_type
from app.services.scan_services import scan_ip, scan_domain, scan_email

@router.post("/analyse")
def analyse(data: analyse_req):

    input_type = detect_type(data.input)

    if input_type == "ip":
        result = scan_ip(data.input)
    elif input_type == "domain":
        result = scan_domain(data.input)
    else:
        result = scan_email(data.input)

    return {
        "input": data.input,
        "type": input_type,
        "result": result
    }
    


