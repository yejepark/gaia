from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.functional_validators import BeforeValidator

from typing import List, Optional, Dict
from typing_extensions import Annotated

from bson import ObjectId
from datetime import datetime
from enum import IntEnum


class TradeType(IntEnum):
    SALE = 1
    JEONSE = 2
    RENT = 3
    SHORTTERM = 4
    GAP = 5


class AssetType(IntEnum):
    APARTMENT = 1,
    STUDIO = 2  # 원룸
    OFFICETEL = 3
    MULTIPLEX = 4  # 다세대
    TOWNHOUSE = 5  # 연립
    MULTIFAMILY = 6  # 다가구
    DETACHED = 7  # 단독
    LAND = 8
    COMMERCIAL = 9
    OFFICE = 10
    BUILDING = 11


# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]


def force_int(v):
    if isinstance(v, str) and len(v) == 0:
        return 0
    else:
        return int(v)


class SellPost(BaseModel):

    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    address_road: str
    address_legal: Optional[str] = None
    features: Optional[List[str]] = []
    area_usage: Optional[float] = None
    area_contract: Optional[float] = None
    floor: Optional[str] = None
    floor_total: Optional[str] = None
    date_available: Optional[str] = None
    premium: Optional[str] = None
    maintenance_cost: Optional[str] = None
    deposit: Optional[str] = None
    rent_monthly: Optional[str] = None
    direction: Optional[str] = None
    business_type: Optional[str] = None
    business_recommended: Optional[str] = None
    parking: Optional[str] = None
    parking_total: Optional[Annotated[int, BeforeValidator(force_int)]] = None
    heat_type: Optional[str] = None
    heat_fuel: Optional[str] = None
    use_area: Optional[str] = None
    building_usage: Optional[str] = None
    main_structure: Optional[str] = None
    date_of_usage_approval: Optional[datetime] = None
    detail: Optional[str] = None
    broker_id: Optional[str] = None
    date_created: datetime
    asset_type: AssetType
    trade_type: TradeType
    pic_urls: Optional[List[str]] = []
    latlng: List[float]

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )


class SellPosts(BaseModel):

    sell_posts: List[SellPost]
