from pydantic import BaseModel, ConfigDict, Field, field_validator, computed_field
from pydantic.functional_validators import BeforeValidator

from typing import List, Optional, Dict, Union, Any
from typing_extensions import Annotated

from bson import ObjectId
from datetime import datetime
from models.enums import TradeType, ProductType, ProductSubType, UnitType, DirectionType


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


class Address(BaseModel):
    top: str
    legal: str = ''
    road: str = ''
    dongName: str = ''
    hoName: str = ''
    detail: str = ''


class FloorsBase(BaseModel):
    picked: List[int] = []
    entireBuilding: bool = False


class Floors(FloorsBase):
    picked: List[str] = []


class PriceBase(BaseModel):
    deposit: int
    monthlyRent: int
    sale: int


class Price(PriceBase):
    depositUnit: UnitType = UnitType.KRW4
    monthlyRentUnit: UnitType = UnitType.KRW4
    saleUnit: UnitType = UnitType.KRW4


class UpkeepBase(BaseModel):
    cost: int


class Upkeep(UpkeepBase):
    costUnit: UnitType = UnitType.KRW4


class PremiumBase(BaseModel):
    exist: bool = False
    negotiable: bool = False
    operation: int
    facility: int
    location: int

    @computed_field(return_type=int)
    def total(self):
        return self.operation + self.facility + self.location


class Premium(PremiumBase):
    operationUnit: UnitType = UnitType.KRW4
    facilityUnit: UnitType = UnitType.KRW4
    locationUnit: UnitType = UnitType.KRW4


class IncomeBase(BaseModel):
    operating: str = 'empty'
    expose: bool = False
    mustAcquire: bool = False
    revenue: int
    rent: int
    cogs: int
    wage: int
    utilityCost: int
    profit: int


class Income(IncomeBase):
    revenueUnit: UnitType = UnitType.KRW4
    rentUnit: UnitType = UnitType.KRW4
    cogsUnit: UnitType = UnitType.KRW4
    wageUnit: UnitType = UnitType.KRW4
    utilityCostUnit: UnitType = UnitType.KRW4
    profitUnit: UnitType = UnitType.KRW4


class LoanBase(BaseModel):
    exist: bool = False
    expose: bool = False
    pct: float


class Loan(LoanBase):
    pctUnit: UnitType = UnitType.PCT


class MoveInDayBase(BaseModel):
    negotiable: bool = False
    date: datetime


class MoveInDay(BaseModel):
    negotiable: bool = False
    Y: int
    M: int
    D: int


class ProductAreaBase(BaseModel):
    use: float
    contract: float


class ProductArea(ProductAreaBase):
    useUnit: UnitType = UnitType.PYUNG
    contractUnit: UnitType = UnitType.PYUNG


class BusinessType(BaseModel):
    storeName: str = ''
    current: str = ''
    recommend: str = ''


class UsageType(BaseModel):
    current: str = ''
    recommend: str = ''


class ParkingBase(BaseModel):
    available: bool = False
    count: int


class Parking(ParkingBase):
    countUnit: UnitType = UnitType.DAE


class FacilityBase(BaseModel):
    heatingMethod: str = ''
    coolingMethod: str = ''
    heatingFuel: str = ''
    electricCap: int


class Facility(FacilityBase):
    electricCapUnit: UnitType = UnitType.kW


class ShortLease(BaseModel):
    length: int
    negotiable: bool = False
    moreOrLess: str = 'more'


class AreaBase(BaseModel):
    plat: float
    arch: float
    total: float


class Area(AreaBase):
    platUnit: UnitType = UnitType.M2
    archUnit: UnitType = UnitType.M2
    totalUnit: UnitType = UnitType.M2


class FloorCountBase(BaseModel):
    ugrnd: int
    grnd: int


class FloorCount(FloorCountBase):
    ugrndUnit: UnitType = UnitType.FLOOR
    grndUnit: UnitType = UnitType.FLOOR


class RoomCountBase(BaseModel):
    ho: int
    household: int
    family: int


class RoomCount(RoomCountBase):
    hoUnit: UnitType = UnitType.GAE
    householdUnit: UnitType = UnitType.GAE
    familyUnit: UnitType = UnitType.GAE


class ParkingCountBase(BaseModel):
    indrAuto: int
    oudrAuto: int
    indrMech: int
    oudrMech: int


class ParkingCount(ParkingCountBase):
    indrAutoUnit: UnitType = UnitType.DAE
    oudrAutoUnit: UnitType = UnitType.DAE
    indrMechUnit: UnitType = UnitType.DAE
    oudrMechUnit: UnitType = UnitType.DAE


class ElevatorCountBase(BaseModel):
    rideUse: int
    emgenUse: int


class ElevatorCount(ElevatorCountBase):
    rideUseUnit: UnitType = UnitType.DAE
    emgenUseUnit: UnitType = UnitType.DAE


class UseApprovalDay(BaseModel):
    Y: int
    M: int
    D: int


class AdPostBase(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    isAgent: bool = False

    tradeType: TradeType
    productType: ProductType
    productSubType: ProductSubType

    # Address Information
    address: Address
    floors: FloorsBase
    latlng: List[float]

    # Product Information
    price: PriceBase
    premium: PremiumBase
    upkeep: UpkeepBase
    income: IncomeBase
    loan: LoanBase
    prodArea: ProductAreaBase
    businessType: BusinessType
    usageType: UsageType
    direction: DirectionType = DirectionType.UNKNOWN
    parking: ParkingBase
    facility: FacilityBase
    shortLease: ShortLease
    moveInDay: MoveInDayBase

    # Building Information
    mainPurpose: str = ''
    districtType: str = ''
    flrCnt: FloorCountBase
    roomCnt: RoomCountBase
    area: AreaBase
    parkingCnt: ParkingCountBase
    elvtCnt: ElevatorCountBase
    strctCdNm: str = ''
    useAprDay: datetime

    pic_urls: List[str] = []

    date_created: datetime = Field(default_factory=datetime.utcnow)
    date_updated: datetime = Field(default_factory=datetime.utcnow)

    user_id: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )


class NewAdPost(AdPostBase):

    # Address Information
    floors: Floors

    # Product Information
    price: Price
    upkeep: Upkeep
    premium: Premium
    income: Income
    loan: Loan
    prodArea: ProductArea
    moveInDay: MoveInDay

    # Building Information
    flrCnt: FloorCount
    roomCnt: RoomCount
    area: Area
    parkingCnt: ParkingCount
    elvtCnt: ElevatorCount
    useAprDay: UseApprovalDay


class AdPosts(BaseModel):

    ad_posts: List[AdPostBase]


class BrTitle(BaseModel):

    mgmBldrgstPk: str

    platGbCd: int
    # 0: land, 1: mountain, 2: block
    regstrGbCd: int
    regstrGbCdNm: str

    bldNm: str
    dongNm: ForcedStr

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


class BrJijigu(BaseModel):

    mgmBldrgstPk: str

    jijiguGbCd: ForcedStr
    jijiguGbCdNm: str

    jijiguCd: ForcedStr
    jijiguCdNm: str

    etcJijigu: str

    crtnDay: ForcedStr


class AddressData(BaseModel):

    id: Optional[PyObjectId] = Field(alias="_id", default=None)

    # address: str
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
    brJijigu: List[BrJijigu] | None = None
    # brTitle: Any | None = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )
