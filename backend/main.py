from decouple import config
from contextlib import asynccontextmanager

import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from motor.motor_asyncio import AsyncIOMotorClient

from routers.sell_posts import router as sell_posts_router


DB_URL = config("DB_URL", cast=str)
DB_NAME = config("DB_NAME", cast=str)
origins = ["*"]


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.mongodb_client = AsyncIOMotorClient(DB_URL)
    app.mongodb = app.mongodb_client[DB_NAME]
    yield
    app.mongodb_client.close()

# instantiate the app
app = FastAPI(lifespan=lifespan)

# add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(sell_posts_router, prefix="/sell_posts",
                   tags=["sell_posts"])

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
