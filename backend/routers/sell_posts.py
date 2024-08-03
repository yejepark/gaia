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
from datetime import datetime
import pytz
from pymongo import ReturnDocument

import cloudinary
import cloudinary.uploader

from models.data_models import SellPost, SellPosts, AddressData, BrTitle, BrJijigu, NewAdPost, AdPostBase, AdPosts
from models.enums import TradeType, ProductType, ProductSubType, UnitType

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

address_to_pic_urls = {
    '서울 강남구 대치동 989-10': [
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204324/Gaia/1690908210_7e688c4bea1ff30ffb8a778f74ae8e0a_rv7a7k.jpg'
    ],
    '서울 강남구 역삼동 779-9': [
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204029/Gaia/7351572e4256fa0e2a88d34ddebb83fc_tdfzoy.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204029/Gaia/232128f82749c8052b8df091c4649b04_krecgg.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204029/Gaia/0b212a4c6cb3ec90010e9bea3eb6a29b_vv7gdt.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204028/Gaia/7f61ebf72ae1392a4e66325ab23cf276_epcawm.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204028/Gaia/0e8d51d1ebcc149ef3eb606bd09a2d9f_rkwsll.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204028/Gaia/5fee434fb2f4f0129ccffdbd6df7f5fa_tp5grq.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204028/Gaia/f3885105443704cc922e74d6c83ed5dd_sstvep.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204028/Gaia/1bf3c0ba48abdfe9644f0c252f63b6fb_nya9j7.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204028/Gaia/ef96300cd48d70d4fb3910e7cb08dd44_lfbxct.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1718204028/Gaia/56340af1b741e118ac364d75c5e851f0_mrolsz.jpg',
    ],
    '서울 강남구 역삼동 785-22': [
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610074/Gaia/2024021311421604_19126_wt_k3fnbw.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610074/Gaia/2024021311414395_19126_wt_qlhndd.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610074/Gaia/2024021311421684_19126_wt_kpvbjk.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610074/Gaia/202402131142162_19126_wt_j5o953.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610074/Gaia/2024021311414373_19126_wt_zqd8zb.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610073/Gaia/2024021311421635_19126_wt_k9ydwm.jpg',
    ],
    '서울 강남구 도곡동 419-3': [
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610137/Gaia/1693753038_aa54aeb1dcf49f2f614d329531ce7318_ypdofx.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610137/Gaia/1693753038_aaec2009243e25d46f8dab25fdd13d7f_vb1pnw.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610136/Gaia/1693753038_60ad9232047b0e928b22102aa9e3f473_iwkegz.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610136/Gaia/1693753038_5ee452124f65bf77bd86ac72600bad9f_pupook.jpg',
        'https://res.cloudinary.com/diq8xz8nn/image/upload/v1722610136/Gaia/1693753038_4eb8eecf806e95267870bb650278d6fb_uc22ox.jpg',
    ]
}

PLACEHOLDER_URL = 'https://images.placeholders.dev/?'

router = APIRouter()


@router.get(
    "/list_all",
    response_description="List all sell posts",
    # response_model=SellPosts,
    response_model=AdPosts,
    response_model_by_alias=False
)
async def list_sell_posts(request: Request):
    # data = await request.app.mongodb['sell_posts'].find().to_list(10)
    # return SellPosts(sell_posts=data)
    data = await request.app.mongodb['ad_posts'].find().to_list(10)
    return AdPosts(ad_posts=data)


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


async def get_gov_data(address_data, target_url, numOfRows=100):
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
        "numOfRows": numOfRows
    }
    # print('request payload')
    # print(json.dumps(payload, indent=2))

    resp = await asyncio.to_thread(
        requests.get, target_url, params=payload
    )
    # print('request repsonse')
    # print(resp.text)
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
        data = [item for item in data if int(item['mainAtchGbCd']) == 0]

    return [BrTitle(**item).model_dump() for item in data]


async def get_br_jijigu_data(address_data, jiyukOnly=True):

    data = await get_gov_data(address_data, br_jijigu_URL, numOfRows=20)

    if jiyukOnly:
        data = [item for item in data if int(item['jijiguGbCd']) == 1]

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
    response_description="Add a new ad post",
    response_model=AdPostBase,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED
)
async def create_ad_post(ad_post: NewAdPost, request: Request):
    data = ad_post.model_dump()

    new_data = {}
    for data_key in [
        'isAgent', 'tradeType', 'productType', 'productSubType',
        'direction', 'mainPurpose', 'districtType', 'strctCdNm', 'latlng'
    ]:
        new_data[data_key] = data[data_key]

    new_data['floors'] = {'entireBuilding': data['floors']['entireBuilding']}
    new_data['floors']['picked'] = []
    for x in data['floors']['picked']:
        if x[0] == 'A':
            new_data['floors']['picked'].append(int(x[1:]))
        else:
            new_data['floors']['picked'].append(-int(x[1:]))

    local_tz = pytz.timezone('Asia/Seoul')

    moveInDay = data['moveInDay']
    new_data['moveInDay'] = {
        'date': local_tz.localize(
            datetime(moveInDay['Y'], moveInDay['M'], moveInDay['D'])
            ).astimezone(pytz.utc),
        'negotiable': moveInDay['negotiable']
    }

    useAprDay = data['useAprDay']
    new_data['useAprDay'] = local_tz.localize(
            datetime(useAprDay['Y'], useAprDay['M'], useAprDay['D'])
            ).astimezone(pytz.utc)

    for data_key in [
        'address', 'price', 'upkeep', 'income', 'premium', 'loan', 'prodArea',
        'businessType', 'usageType', 'parking', 'facility', 'shortLease',
        'flrCnt', 'roomCnt', 'area', 'parkingCnt', 'elvtCnt',
    ]:
        new_data[data_key] = {}

        for value_key in data[data_key].keys():
            if not value_key.endswith('Unit'):
                new_data[data_key][value_key] = data[data_key][value_key]

                unit_key = value_key + 'Unit'
                if unit_key in data[data_key]:
                    if data[data_key][unit_key] == UnitType.KRW4:
                        new_data[data_key][value_key] *= 10**4

                    elif data[data_key][unit_key] == UnitType.PCT:
                        new_data[data_key][value_key] *= 0.01

                    elif data[data_key][unit_key] == UnitType.PYUNG:
                        new_data[data_key][value_key] *= 3.30579

                    elif data[data_key][unit_key] == UnitType.kW:
                        new_data[data_key][value_key] *= 10**3

    # print(new_data)

    address_legal = data['address']['legal']
    address_road = data['address']['road']
    if address_legal in address_to_pic_urls:
        new_data['pic_urls'] = address_to_pic_urls[address_legal]
    else:
        new_data['pic_urls'] = [
            PLACEHOLDER_URL + 'text=' + address_legal,
            PLACEHOLDER_URL + 'text=' + address_road,
        ]

    new_post = await request.app.mongodb['ad_posts'].insert_one(
        AdPostBase(**new_data).model_dump(by_alias=True, exclude=['id'])
    )

    # print(json.dumps(
    #     sell_post.model_dump(by_alias=True, exclude=['id']),
    #     indent=2, default=str))

    # new_post = await request.app.mongodb['sell_posts'].insert_one(
    #     sell_post.model_dump(by_alias=True, exclude=['id'])
    # )
    created_post = await request.app.mongodb['ad_posts'].find_one(
        {"_id": new_post.inserted_id}
    )
    return created_post
    
    # return sell_post

    # return SellPostBase(**new_data)
