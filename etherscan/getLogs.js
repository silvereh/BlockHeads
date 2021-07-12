
'use strict'

/**
 * SETUP
 * npm install axios
 **/

const axios = require( 'axios' )

/**
 * @param args   object  May contain address, fromBlock, toBlock, topics
 *   address:    string  The contract address you want logs for
 *   fromBlock:  number  0 or the block number you want to start searching after
 *   toBlock:    number  'latest' or the block number you want to end searching before
 *   topics:     array   @see README.md
 * @returns  array  An array of "log" objects that were found.  Max length 1000
 *   For log format, @see README.md
 * @see https://etherscan.io/apis#logs
 **/
async function getLogs( args ){
    let queryData = args ? args : {}
    queryData = {
        ...queryData,
        'apikey': ETHERSCAN_API_KEY,
        'module': 'logs',
        'action': 'getLogs'
    }
    console.debug({ queryData });

    const url = `https://api.etherscan.io/api?${getQueryString( queryData )}`
    console.info({ url });

    const response = await axios.get( url )
    if( response.status === 200 ){
        //console.info( response.data )
        return response.data.result
    }
    else{
      console.warn({ response });
        throw new Error( `${response.status}: ${response.data}` )
    }
}

/**
 * @param queryData  object  Data to convert to query string
 * @returns  string  The compiled query string without leading ?
 **/
function getQueryString( queryData ){
  let queryString = ''
  for( let [ key, value ] of Object.entries( queryData ) ){
    if( queryString )
      queryString += '&'

    queryString += encodeURIComponent( key ) +'='+ encodeURIComponent( value )
  }

  console.trace({ queryString });
  return queryString
}

module.exports = Etherscan
