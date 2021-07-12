
# Etherscan APIs, etc

---
2021-07-12: Added getLogs.js which shows how to use the Etherscan API to query for logs on the chain.

---
## getLogs

### Request

#### topics
The `topics` argument is complex.  You can filter the logs by the event type.  To do this, putting an array of event hashes into the first index of this argument:
```
[
  [
    // Transfer( index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId )
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',

    // Approval( index_topic_1 address owner, index_topic_2 address approved, index_topic_3 uint256 tokenId )
    '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
  ]
]
```

The later indexes refer to argument values, so if you wanted to isolate your query to "mints", your `topics` would look like this.  **Notice** that if you're only trying to match one item, the value may be scalar.
```
[
  // Transfer( index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId )
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',

  //from 0x0
  '0x00000000000000000000000000000000000000ff'
]
```

To isolate your query to "burns", your `topics` would look like this:
```
[
  // Transfer( index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId )
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',

  //from
  null,

  //to 0x0
  '0x00000000000000000000000000000000000000ff'
]
```


### Response
Each log contains the following attributes:
 - `address` string, hex, the contract address the event occurred on
 - `blockNumber` string, hex, converts to integer
 - `logIndex` string, hex, converts to integer
 - `transactionIndex` string, hex, converts to integer
 - `timeStamp` string, hex, converts to unix timestamp
 **NOTE**: multiple by 1000 to create JS Date object
 - `topics` string[], the hashes indicating the event that occurred and its parameters.  Example:
 ```
 // Transfer (index_topic_1 address from, index_topic_2 address to, index_topic_3 uint256 tokenId)
 log.topics = [
   '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', //Transfer
   '0xe7c7652969ab78b74c7921041416a82632ea7b2d', //from address
   '0x9dfd5908810d6eb9f0e4fc873df17d810b96961c', //to address
   '0x00000000000000000000000000000000000000ff'  //tokenId
 ]

 //NOTE: either address may be 0x0 indicating a mint (from address) or burn (to address)
 ```
