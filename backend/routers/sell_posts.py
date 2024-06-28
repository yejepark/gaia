from fastapi import (
    APIRouter, Request, HTTPException, status,
    UploadFile, File, Form
)
from bson import ObjectId
from decouple import config
import requests
import json
import asyncio
import re

import cloudinary
import cloudinary.uploader

from models.data_models import SellPost, SellPosts, AddressData, BrTitle

CLOUD_NAME = config("CLOUD_NAME", cast=str)
API_KEY = config("CLOUD_API_KEY", cast=str)
API_SECRET = config("CLOUD_API_SECRET", cast=str)

GOV_API_SERVICE_KEY = config("GOV_API_SERVICE_KEY", cast=str)

GOV_DATA_URL = "http://apis.data.go.kr/1613000/BldRgstService_v2/getBrTitleInfo"

cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=API_KEY,
    api_secret=API_SECRET,
)

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


async def get_br_title_data(address_data, mainAtchOnly=True):
    jibun_match = re.search(r"[\-0-9]+$", address_data.jibunAddress)
    jibun = jibun_match.group().split('-')
    bun = jibun[0].zfill(4)
    ji = jibun[1].zfill(4) if len(jibun) == 2 else '0000'

    payload = {
        "ServiceKey": GOV_API_SERVICE_KEY,
        "_type": "json",
        "sigunguCd": address_data.sigunguCode,
        "bjdongCd": address_data.bcode[5:],
        "bun": bun,
        "ji": ji,
        "numOfRows": 100
    }
    # print('request payload')
    # print(json.dumps(payload, indent=2))

    gov_resp = await asyncio.to_thread(
        requests.get, GOV_DATA_URL, params=payload
    )
    # print('request repsonse')
    # print(gov_resp.text)
    gov_data = json.loads(gov_resp.text)

    if gov_data['response']['header']['resultCode'] != '00':
        return []

    br_title = gov_data['response']['body']['items']
    if len(br_title) == 0 or 'item' not in br_title:
        return []

    br_title = br_title['item']

    if isinstance(br_title, dict):
        return [BrTitle(**br_title).model_dump()]

    if mainAtchOnly:
        br_title = [item for item in br_title if item['mainAtchGbCd'] == 0]

    return [BrTitle(**item).model_dump() for item in br_title]


@router.post(
    "/address_data/create",
    response_description="Add an address data",
    response_model=AddressData,
    status_code=status.HTTP_201_CREATED
)
async def create_address_data(address_data: AddressData, request: Request):

    print(address_data)

    # br_title = await get_br_title_data(address_data)

    existing_data = await request.app.mongodb['address_data'].find_one(
        {
            "jibunAddress": address_data.jibunAddress,
            "roadAddress": address_data.roadAddress,
        }
    )

    if existing_data is not None:
        return existing_data

    br_title = await get_br_title_data(address_data)

    payload = address_data.model_dump(by_alias=True, exclude=['id'])
    payload.update({'brTitle': br_title})
    new_data = await request.app.mongodb['address_data'].insert_one(payload)
    created_data = await request.app.mongodb['address_data'].find_one(
        {"_id": new_data.inserted_id}
    )
    return created_data


@router.post(
    "/create",
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
