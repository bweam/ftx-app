import * as ccxt from 'ccxt';
// import { client0, client2 } from './client.credentials';
require('dotenv').config(); 

const API_KEY = process.env.API_KEY;
const SECRET = process.env.SECRET;
const SUBACCOUNT = process.env.SUBACCOUNT;

export const exchangeId = 'ftx'
    , exchangeClass = ccxt[exchangeId]
    , exchange = new exchangeClass ({
      apiKey: API_KEY,
      secret: SECRET,
      'headers': {
        'FTX-SUBACCOUNT':SUBACCOUNT
      }
    })

export interface settings {
  tokenList, //list of names of rebalancing token
  pairList, //list of names of rebalancing pair eg. XRP/USD
  ratioList //list of ratios
}