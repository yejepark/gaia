from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.functional_validators import BeforeValidator

from typing import List, Optional, Dict, Union
from typing_extensions import Annotated

from bson import ObjectId
from datetime import datetime
from models.enums import AssetType, TradeType


# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]


def force_int(v):
    if isinstance(v, str) and len(v) == 0:
        return 0
    else:
        return int(v)


def force_float(v):
    if isinstance(v, str) and len(v) == 0:
        return 0.
    else:
        return float(v)


ForcedInt = Annotated[int, BeforeValidator(force_int)]
ForcedStr = Annotated[str, BeforeValidator(str)]


class SellPost(BaseModel):

    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    address_road: Optional[str] = None
    address_legal: Optional[str] = None

    area_usage: Optional[float] = None
    area_contract: Optional[float] = None

    floor: Optional[Union[float, str]] = None
    floor_total: Optional[int] = None
    direction: Optional[str] = None

    date_available: Optional[Union[str, datetime]] = None

    premium: Optional[ForcedInt] = None
    maintenance_cost: Optional[ForcedInt] = None
    deposit: Optional[ForcedInt] = None
    rent_monthly: Optional[ForcedInt] = None

    business_type: Optional[str] = None
    business_subtype: Optional[str] = None
    business_recommended: Optional[str] = None

    parking: Optional[Union[str, int]] = None
    parking_total: Optional[ForcedInt] = None

    heat_type: Optional[str] = None
    heat_fuel: Optional[str] = None

    use_area: Optional[str] = None
    building_usage: Optional[str] = None
    main_structure: Optional[str] = None

    date_of_usage_approval: Optional[datetime] = None

    features: Optional[List[str]] = []
    facilities: Optional[List[str]] = []
    detail: Optional[str] = None

    broker_id: Optional[str] = None

    date_created: datetime = Field(default_factory=datetime.utcnow)
    date_updated: datetime = Field(default_factory=datetime.utcnow)

    asset_type: AssetType = Field(default=AssetType.COMMERCIAL)
    trade_type: TradeType = Field(default=TradeType.RENT)

    pic_urls: Optional[List[str]] = []
    latlng: List[float] = []

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )


class SellPosts(BaseModel):

    sell_posts: List[SellPost]


class BrTitle(BaseModel):

    mgmBldrgstPk: str

    platGbCd: int 
    # 0: land, 1: mountain, 2: block
    regstrGbCd: int
    regstrGbCdNm: str

    bldNm: str
    dongNm: str

    platArea: float
    vlRatEstmTotArea: float
    # vlRatEstmTotArea / platarea = floor area ratio
    archArea: float
    # archArea / platarea = building-to-land ratio
    totArea: float

    grndFlrCnt: int
    ugrndFlrCnt: int

    fmlyCnt: int
    hhldCnt: int
    hoCnt: int

    indrAutoUtcnt: int
    indrMechUtcnt: int
    oudrAutoUtcnt: int
    oudrMechUtcnt: int

    emgenUseElvtCnt: int
    rideUseElvtCnt: int

    mainAtchGbCd: int
    mainAtchGbCdNm: str

    strctCd: int
    strctCdNm: str

    mainPurpsCd: ForcedStr
    mainPurpsCdNm: str
    etcPurps: str

    useAprDay: ForcedStr
    crtnDay: ForcedStr


class AddressData(BaseModel):

    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    address: str
    jibunAddress: str
    roadAddress: str
    bcode: ForcedStr
    buildingName: str
    buildingCode: ForcedStr
    roadname: str
    roadnameCode: ForcedStr
    sido: str
    sigungu: str
    sigunguCode: ForcedStr
    zonecode: ForcedStr
    latlng: List[str]

    brTitle: List[BrTitle] | None = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )
