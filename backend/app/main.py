from fastapi import FastAPI
import uvicorn
from app.routes.analyse import router

app=FastAPI()
app.include_router(router)
@app.get("/")
def home():
    return {"message":"yesss"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", reload=True)