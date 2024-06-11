from fastapi import APIRouter, Request, HTTPException, status
from bson import ObjectId

from models.data_models import SellPost, SellPosts


router = APIRouter()


@router.get(
    "/list_all",
    response_description="List all sell posts",
    response_model=SellPosts,
    response_model_by_alias=False
)
async def list_sell_posts(request: Request):
    data = await request.app.mongodb['sell_posts'].find().to_list(10)
    return SellPosts(sell_posts=data)


@router.get(
    "/{id}",
    response_description="Get a single sell post",
    response_model=SellPost,
    response_model_by_alias=False
)
async def show_sell_post(id: str, request: Request):
    post = await request.app.mongodb['sell_posts'].find_one(
        {"_id": ObjectId(id)})
    if post is not None:
        return post
    raise HTTPException(status_code=404, detail=f"sell post {id} not found")


@router.post(
    "/",
    response_description="Add a new sell post",
    response_model=SellPost,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED
)
async def create_sell_post(sell_post: SellPost, request: Request):
    new_post = await request.app.mongodb['sell_posts'].insert_one(
        sell_post.model_dump(by_alias=True, exclude=['id'])
    )
    created_post = await request.app.mongodb['sell_posts'].find_one(
        {"_id": new_post.inserted_id}
    )
    return created_post
