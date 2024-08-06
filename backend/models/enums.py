from enum import Enum, IntEnum


class TradeType(str, Enum):
    SALE = 'sale'
    LEASE = 'lease'
    SHORTLEASE = 'shortLease'


class ProductType(str, Enum):
    COMMERCIAL = 'commercial'
    OFFICE = 'office'
    INDUSTRIAL = 'industrial'
    INT_IND_CENTER = 'intIndCenter'
    LODGING = 'lodging'
    BUILDING = 'building'


class ProductSubType(str, Enum):
    COMMUNITY = 'community'
    COMPLEX = 'complex'
    GENERAL = 'general'
    LARGE = 'large'
    MID_SMALL = 'midSmall'
    OFFICETEL = 'officetel'
    FACTORY = 'factory'
    STORAGE = 'storage'
    OTHER = 'other'
    BUILDING = 'building'
    LEISURE = 'leisure'
    SPECIAL = 'special'


class UnitType(str, Enum):
    KRW = '원'
    KRW4 = '만원'
    PYUNG = '평'
    M2 = 'm2'
    PCT = '%'
    DAE = '대'
    GAE = '개'
    kW = 'kW'
    FLOOR = '층'


class DirectionType(str, Enum):
    EAST = '동'
    WEST = '서'
    SOUTH = '남'
    NORTH = '북'
    SOUTH_EAST = '남동'
    SOUTH_WEST = '남서'
    NORTH_EAST = '북동'
    NORTH_WEST = '북서'
    UNKNOWN = ''


class SortType(str, Enum):
    NEWEST = '최신순'
    OLDEST = '오래된순'
    RENT = '월세순'
    RENT_REV = '월세역순'
    PREMIUM = '권리금순'
    PREMIUM_REV = '권리금역순'
    SALE = '가격순'
    SALE_REV = '가격역순'
    SMALL = '면적순'
    BIG = '면적역순'

# class AssetType(IntEnum):
#     APARTMENT = 1
#     STUDIO = 2  # 원룸
#     OFFICETEL = 3
#     MULTIPLEX = 4  # 다세대
#     TOWNHOUSE = 5  # 연립
#     MULTIFAMILY = 6  # 다가구
#     DETACHED = 7  # 단독
#     LAND = 8
#     COMMERCIAL = 9
#     OFFICE = 10
#     BUILDING = 11
