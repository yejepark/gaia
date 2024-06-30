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
from pymongo import ReturnDocument

import cloudinary
import cloudinary.uploader

from models.data_models import SellPost, SellPosts, AddressData, BrTitle, BrJijigu

CLOUD_NAME = config("CLOUD_NAME", cast=str)
API_KEY = config("CLOUD_API_KEY", cast=str)
API_SECRET = config("CLOUD_API_SECRET", cast=str)

GOV_API_SERVICE_KEY = config("GOV_API_SERVICE_KEY", cast=str)

gov_base_url = "http://apis.data.go.kr/1613000/BldRgstService_v2/"
br_title_URL = gov_base_url + "getBrTitleInfo"
br_jijigu_URL = gov_base_url + "getBrJijiguInfo"

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


async def get_gov_data(address_data, target_url):
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
    print('request payload')
    print(json.dumps(payload, indent=2))

    resp = await asyncio.to_thread(
        requests.get, target_url, params=payload
    )
    print('request repsonse')
    print(resp.text)
    resp_dict = json.loads(resp.text)

    if resp_dict['response']['header']['resultCode'] != '00':
        return []

    data = resp_dict['response']['body']['items']
    if len(data) == 0 or 'item' not in data:
        return []

    data = data['item']

    if isinstance(data, dict):
        return [data]

    return data


async def get_br_title_data(address_data, mainAtchOnly=True):

    data = await get_gov_data(address_data, br_title_URL)

    if mainAtchOnly:
        data = [item for item in data if item['mainAtchGbCd'] == 0]

    return [BrTitle(**item).model_dump() for item in data]


async def get_br_jijigu_data(address_data):

    data = await get_gov_data(address_data, br_jijigu_URL)

    return [BrJijigu(**item).model_dump() for item in data]


@router.post(
    "/address_data/create",
    response_description="Add an address data",
    response_model=AddressData,
    status_code=status.HTTP_201_CREATED
)
async def create_address_data(address_data: AddressData, request: Request):

    # print(address_data)

    id_dict = {
        "jibunAddress": address_data.jibunAddress,
        "roadAddress": address_data.roadAddress
    }

    existing_data = await request.app.mongodb['address_data'].find_one(id_dict)
    # print(existing_data)

    if existing_data is not None:
        print('-'*10, 1)
        update_dict = {}

        br_title_not_exist = (
            'brTitle' not in existing_data or
            len(existing_data['brTitle']) == 0
        )
        if br_title_not_exist:
            br_title = await get_br_title_data(address_data)
            update_dict['brTitle'] = br_title

        br_jijigu_not_exist = (
            'brJijigu' not in existing_data or 
            len(existing_data['brJijigu']) == 0
        )
        if br_jijigu_not_exist:
            print('-'*10, 2)
            br_jijigu = await get_br_jijigu_data(address_data)
            print(br_jijigu)
            update_dict['brJijigu'] = br_jijigu

        if br_title_not_exist or br_jijigu_not_exist:
            updated_data = await request.app.mongodb['address_data'].find_one_and_update(
                id_dict,
                {'$set': update_dict},
                return_document=ReturnDocument.AFTER
            )
            return updated_data

        return existing_data

    br_title = await get_br_title_data(address_data)
    br_jijigu = await get_br_jijigu_data(address_data)

    payload = address_data.model_dump(by_alias=True, exclude=['id'])
    payload.update({'brTitle': br_title, 'brJijigu': br_jijigu})
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
