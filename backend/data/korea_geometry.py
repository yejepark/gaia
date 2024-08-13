import os
import pandas as pd
import geopandas as gpd
import shapely.geometry as geom
import shapely as sh
import re
# import matplotlib.pyplot as plt

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient


data_dir = './korea_geometry_data'


def get_region_data(updated='2023-07-01'):
    path_ctp = os.path.join(data_dir, 'ctprvn_20230729.zip')
    path_sig = os.path.join(data_dir, 'sig_20230729.zip')
    path_emd = os.path.join(data_dir, 'emd_20230729.zip')

    df_ctp = gpd.read_file(path_ctp, encoding='cp949')
    df_sig = gpd.read_file(path_sig, encoding='cp949')
    df_emd = gpd.read_file(path_emd, encoding='cp949')

    df_ctp.columns = ['CTP_CD', 'CTP_ENG_NM', 'CTP_NM', 'geometry']
    df_sig.columns = ['SIG_CD', 'SIG_ENG_NM', 'SIG_NM', 'geometry']
    df_emd.columns = ['EMD_CD', 'EMD_ENG_NM', 'EMD_NM', 'geometry']

    df_sig['CTP_CD'] = df_sig['SIG_CD'].apply(lambda x: x[:2])
    sub_columns = ['CTP_CD', 'CTP_ENG_NM', 'CTP_NM']
    df_sig = pd.merge(df_ctp[sub_columns], df_sig, on='CTP_CD')

    df_emd['SIG_CD'] = df_emd['EMD_CD'].apply(lambda x: x[:5])
    sub_columns = ['CTP_CD', 'CTP_NM', 'CTP_ENG_NM',
                   'SIG_CD', 'SIG_NM', 'SIG_ENG_NM']
    df_emd = pd.merge(df_sig[sub_columns], df_emd, on='SIG_CD')

    df = pd.concat([df_ctp, df_sig, df_emd]).set_crs(epsg=5179)
    df['area'] = df.area
    df['center'] = df.centroid.to_crs(epsg=4326)
    df = df.to_crs(epsg=4326)

    bound_df = df.bounds.apply(
        lambda row: pd.Series({
            'sw': sh.Point(row.minx, row.miny),
            'ne': sh.Point(row.maxx, row.maxy)
        }), axis=1
    )
    df['sw'] = bound_df['sw']
    df['ne'] = bound_df['ne']
    df['updated'] = updated
    df['FULL_NM'] = (
        df['CTP_NM'] + ' ' +
        df['SIG_NM'].fillna('') + ' ' +
        df['EMD_NM'].fillna('')
    ).apply(lambda x: x.strip())

    df_sig['SIG_CD'] = df_sig['SIG_CD'].astype('string')

    return df, df_sig


def get_sangkwon_data():
    path_comm = os.path.join(data_dir, 'SangKwon_20230331.xlsx')

    df = pd.read_excel(path_comm)
    df.columns = ['BD_CD', 'BD_NM', 'CTP_CD',
                  'CTP_NM', 'SIG_CD', 'SIG_NM', 'N_XY', 'XYs', 'updated']
    df['geometry'] = df['XYs'].apply(
        lambda x: geom.Polygon([y.strip('() ').split(',') for y in x.split('|')]))

    df['BD_NM_H'] = df['BD_NM'].apply(
        lambda x: re.sub('[1-9]$', '', x).strip('-_ '))

    df = df.sort_values(by=['SIG_CD', 'BD_NM'])
    # print(df)

    df_cnt = df.groupby(by=['SIG_CD', 'BD_NM_H']).apply(
        lambda x: pd.Series([1] * len(x), name='BD_NM_CNT') * len(x),
        include_groups=False
    ).reset_index().rename({'level_2': 'BD_NM_IDX'}, axis=1)

    df_cnt['BD_NM_IDX'] += 1

    df = pd.concat([
        df.reset_index(drop=True),
        df_cnt[['BD_NM_IDX', 'BD_NM_CNT']]
    ], axis=1)

    df = gpd.GeoDataFrame(df, geometry='geometry')

    # Parse XYs into geometry -----------------------------
    df['gtype'] = 0

    dfx = df[~df['geometry'].is_valid]

    df.loc[dfx.index, 'geometry'] = dfx['XYs'].apply(
        lambda XYs: re.findall(r'\(\(([0-9\.,|]+)\)\)', '((' + XYs + '))')
    ).apply(
        lambda poly_strs:
        sh.MultiPolygon([
            sh.Polygon([
                coords.split(',')
                for coords in poly_str.split('|')
            ])
            for poly_str in poly_strs
        ])
    )
    df.loc[dfx.index, 'gtype'] = 1

    dfx = df[df['geometry'].apply(lambda x: x.is_empty)]

    df.loc[dfx.index, 'geometry'] = dfx['XYs'].apply(
        lambda XYs: re.findall(r'\(([0-9\.,|]+)\)', '('+XYs+')')
    ).apply(
        lambda poly_strs: [
            [coord.split(',') for coord in poly_str.split('|')]
            for poly_str in poly_strs
        ]
    ).apply(lambda cs: sh.Polygon(cs[0], cs[1:]))

    df.loc[dfx.index, 'gtype'] = 2

    # Compute geometrical properties --------------------
    df = df.set_crs(epsg=4326).to_crs(epsg=5179)
    # df = df.set_crs(epsg=4326).to_crs(epsg=5181)

    df['area'] = df.area
    df['center'] = df.centroid.to_crs(epsg=4326)

    df = df.to_crs(epsg=4326)

    bound_df = df.bounds.apply(
        lambda row: pd.Series({
            'sw': sh.Point(row.minx, row.miny),
            'ne': sh.Point(row.maxx, row.maxy)
        }), axis=1
    )
    df['sw'] = bound_df['sw']
    df['ne'] = bound_df['ne']

    df['FULL_NM'] = (
        df['CTP_NM'] + ' ' +
        df['SIG_NM'].fillna('') + ' ' +
        df['BD_NM_H'].fillna('')
    ).apply(lambda x: x.strip())

    df['SIG_CD'] = df['SIG_CD'].astype('string')
    df['BD_CD'] = df['BD_CD'].astype('string')

    return df


def insert_data(df, collection_name='geometry_data'):

    DB_URL = 'mongodb://localhost:27017'
    DB_NAME = 'gaia'

    # client = AsyncIOMotorClient(DB_URL)
    client = MongoClient(DB_URL)

    db = client[DB_NAME]

    data = [
        {
            k: sh.geometry.mapping(v) if isinstance(v, sh.geometry.base.BaseGeometry) else v
            for k, v in d.items() if pd.notnull(v)
        }
        for d in df.to_dict('records')
    ]

    db[collection_name].insert_many(data)

    client.close()

    return


df_r, df_sig = get_region_data()
df_sk = get_sangkwon_data()

sub_columns1 = [
    'SIG_CD', 'BD_CD', 'BD_NM', 'BD_NM_H', 'FULL_NM', 'BD_NM_IDX', 'BD_NM_CNT',
    'updated', 'geometry', 'gtype', 'area', 'center', 'sw', 'ne', 'N_XY', 'XYs'
]
sub_columns2 = [
    'CTP_CD', 'CTP_ENG_NM', 'CTP_NM',
    'SIG_CD', 'SIG_ENG_NM', 'SIG_NM',
]
df_sk = pd.merge(df_sig[sub_columns2], df_sk[sub_columns1], on='SIG_CD')

# df = df_comm.dissolve(by='group_idx')
