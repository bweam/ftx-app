from tabnanny import check
import time
import urllib.parse
from typing import Optional, Dict, Any, List
import operator
from webbrowser import get

from requests import Request, Session, Response
import hmac
import ftx
import ccxt
import math

c2 = ccxt.ftx({
    'apiKey' : 'kWi7SaInWUzbeol2yMJGDqJ4tFMbaxXojzMc_fut',
    'secret' : 'Lt5VNd7m4PTMr8bfU_mgr5WjbCsbDsLLk5TwrWSj',
    'headers': {'FTX-SUBACCOUNT' : 'BeamProject1'},
})

c = ccxt.ftx({
    'apiKey': 'n8LLsLB23LzhAAO42cXeDYldA-z-S1NixlcRe-nz',
    'secret': 'CZYWg2hjCYEWs66BsaDUlJk_aXp-Mumroc5lVh6l',
    'enableRateLimit': True,
    'headers': {'FTX-SUBACCOUNT': 'TestFutureXRPBlue'},
})

#Functions
def get_wallet_details():
    wallet = c2.privateGetWalletBalances()['result']
    return wallet

def get_total_asset_value(wallet):
    wallet = wallet
    total_asset_value = 0

    for item in wallet:
        asset_value = round(float(item['usdValue']),2)
        total_asset_value += asset_value
    
    return total_asset_value

def get_cash():
    wallet = c2.privateGetWalletBalances()['result']
    for t in wallet:
        if t['coin'] == 'USD':
            cash = float(t['availableWithoutBorrow'] )
    return cash


futures = dict(c.fetch_positions()[0])
# print(c.fetch_positions())
# print(c.fetch_my_trades())
# print(c.privateGetWalletBalances()['result'])
# print(get_cash())
# print(get_wallet_details())
# print(get_total_asset_value(get_wallet_details()))
# print(c2.fetch_positions())
# print(futures)
# print(futures['cost'])



# print(c.fetch_my_trades())
# print(c.fetch_open_orders())
# WE FIX COST AT 158
fixedCost = 158

def checkForRebalance(): #SOL
    while True: 
        walletDict = dict()
        for i in get_wallet_details(): 
            walletDict[i['coin']] = float(i['usdValue'])
        if (abs(walletDict['SOL'] - 1000) >= 10):
            print(str(walletDict['SOL']) + ' REBALANCE NOW!')
        else:
            print(walletDict['SOL'])
        time.sleep(5)


checkForRebalance()
# print("orders: " , c.fetch_orders())
# def rebalanceXRP_PERP():
#     futures = dict(c.fetch_positions()[0])
#     if abs(float(futures['cost']) - fixedCost) <= 0.5:
#         return
#     if float(futures['cost']) > fixedCost:
#         sizeOrder = ((float(futures['cost'])) - fixedCost)/float((futures['entryPrice']))
#         print("sell", math.floor(sizeOrder))
#         # print(c.create_market_sell_order('XRP-PERP', math.floor(sizeOrder)))
#         return
#     if float(futures['cost']) < fixedCost:
#         sizeOrder = (abs((float(futures['cost'])) - fixedCost))/float((futures['entryPrice']))
#         print("buy", math.floor(sizeOrder))
#         # print(c.create_market_buy_order('XRP-PERP', math.floor(sizeOrder)))
#         return


# rebalanceXRP_PERP()