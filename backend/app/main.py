from fastapi import FastAPI
import uvicorn
from app.routes.analyse import router
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()
app.include_router(router)
@app.get("/")
def home():
    return {"message":"yesss"}



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
     uvicorn.run(app)