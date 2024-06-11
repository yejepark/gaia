from enum import IntEnum


class TradeType(IntEnum):
    SALE = 1
    JEONSE = 2
    RENT = 3
    SHORTTERM = 4
    GAP = 5


class AssetType(IntEnum):
    APARTMENT = 1
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
