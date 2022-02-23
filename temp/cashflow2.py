import time
import urllib.parse
from typing import Optional, Dict, Any, List
import operator

from requests import Request, Session, Response
import hmac
import ftx
import ccxt
import math

c = ccxt.ftx({
    'apiKey': 'n8LLsLB23LzhAAO42cXeDYldA-z-S1NixlcRe-nz',
    'secret': 'CZYWg2hjCYEWs66BsaDUlJk_aXp-Mumroc5lVh6l',
    'enableRateLimit': True,
    'headers': {'FTX-SUBACCOUNT': 'TestFutureXRPBlue'},
})

print(c.fetch_orders()[-1]) #order to calculate cf

# first_order = c.fetch_orders()[-1]
first_order = {'info': {'id': '67888345174', 'clientId': None, 'market': 'XRP-PERP', 'type': 'market', 'side': 'buy', 'price': None, 'size': '1000.0', 'status': 'closed', 'filledSize': '1000.0', 'remainingSize': '0.0', 'reduceOnly': False, 'liquidation': False, 'avgFillPrice': '0.7297532894736842', 'postOnly': False, 'ioc': True, 'createdAt': '2021-08-02T04:07:56.623387+00:00', 'future': 'XRP-PERP'}, 
'id': '67888345174', 'clientOrderId': None, 'timestamp': 1627877276623, 'datetime': '2021-08-02T04:07:56.623Z', 'lastTradeTimestamp': None, 'symbol': 'XRP-PERP', 'type': 'market', 'timeInForce': None, 'postOnly': False, 'side': 'buy', 'price': 0.737, 'stopPrice': None, 'amount': 1000.0, 'cost': 737, 'average': 0.737, 'filled': 1000.0, 'remaining': 0.0, 'status': 'closed', 'fee': None, 'trades': None}
first_size = first_order['amount']
first_price = first_order['price']

capital = [first_price, 2]
side = first_order['side']
stack = [capital]
stack.append([0.740, 12])

cashflow = 0

def calculate_cf(price, size):
    return(abs(stack[-1][0] - price) * size)

def execute_cf():
    global capital_size
    global cashflow
    global side

    order = c.fetch_orders()[-1]

    print("amount: " + str(order['amount']))

    loop = True
    while(loop):
        if (stack == []):
            stack.append([order['price'], order['amount']])
            side = order['side']
            return
        if (order['side'] != side):
            if (stack[-1][1] >= order['amount']):
                    cashflow += calculate_cf(order['price'], order['amount'])
                    stack[-1][1] -= order['amount']
                    return
            else:
                cashflow += calculate_cf(order['price'], stack[-1][1])
                order['amount'] -= stack[-1][1]
                stack.pop()
        else:
            stack.append([order['price'], order['amount']])
            return

def calculate_fees(id):
    fees = 0
    for trade in c.fetch_my_trades(params={'orderId': id}):
        # print(trade['fee']['cost'])
        fees += trade['fee']['cost']
    return fees

print("initial stack: " + str(stack))
execute_cf()

print("cf: " + str(cashflow))
print("final stack: " + str(stack))

# print(c.fetch_my_trades(params={'orderId': '67888345175'}))
print("fees: " + str(calculate_fees(67888345175)))
