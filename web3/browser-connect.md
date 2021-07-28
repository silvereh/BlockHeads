# Web3: 3 steps to connect the browser wallet

---
## Important Methods:
- Soft check: <em>(async)</em> Get the permissions granted to this website
```js
top.ethereum.request({ method: 'wallet_getPermissions' })
```

- Soft check: <em>(async)</em> Get accounts allowed/enabled for this website
```js
top.ethereum.request({ method: 'eth_accounts' })
```

- Hard check: <em>(async)</em> Prompt the user to allowe/enable accounts for this website
```js
top.ethereum.request({ method: 'eth_requestAccounts' })
```

---
## Notes:
- Wallets do not connect to "offline" webpages
- Squeebo has been coding websites (and other stuff) for 20 years. `top` is "a reference to the topmost window in the window hierarchy."
See [MDN: window.top](https://developer.mozilla.org/en-US/docs/Web/API/Window/top)


---
## Lecture:
If you read the MM getting started guide, they say you should only prompt the user for accounts ("hard check") after the user clicks on something.
So, let's assume this will be a "Connect Wallet..." button, and set it aside.
For now, we start with soft checks, which are the bread and butter of a good app.

---
### 1. Permissions
`web.ethereum` provides the following async method to found out what your website is allowed to do:
```js
const permissions = await top.ethereum.request({ method: 'wallet_getPermissions' })
```
    
And because wallet access is our primary concern, this is the value we need to look for `permissions[i].parentCapability === 'eth_accounts'`
  
**Putting it together:**
```js
const permissions = await top.ethereum.request({ method: 'wallet_getPermissions' })
const hasAccountsPermission = permissions.some( p => p.parentCapability === 'eth_accounts' )
```
Now we know if we're allowed to get accounts from the wallet.
    
---
### 2. Accounts
If the user has come to your site before, you should have permission (#1) to get the accounts from their wallet.
But it doesn't make sense to request something without permission, so we'll combine these requests:
    
```js
(async () => {
  //store this globally
  var accounts = []

  const permissions = await top.ethereum.request({ method: 'wallet_getPermissions' })
  const hasAccountsPermission = permissions.some( p => p.parentCapability === 'eth_accounts' )
  if( hasAccountPermission ){
    //assign it to the global variable
    accounts = await top.ethereum.request({ method: 'eth_accounts' })
  }
})()
```

Now we have enough information to decide:
do we need to ask the user for their wallet/addresses?

---
### 3. Requesting Accounts
If we don't have permission, or if we don't have any accounts, the answer is yes.
Now we will expose the "Connect Wallet..." button from step 1 and give it a callback function.

```js
(async () => {
  if( hasAccountPermission && accounts && accounts.length ){
    const connectButton = document.getElementById( 'connect-button' )
    connectButton.style.display = 'none'
  }
  else{
    //no accounts :-(
    const connectButton = document.getElementById( 'connect-button' )
    connectButton.style.display = 'inline-block'
    connectButton.addEventListener( 'click', e => {
      //you might need this is you use an anchor <a />
      if( e.cancelable )
        e.preventDefault()

      //the user clicked out button, so now we can do the hard check
      accounts = await top.ethereum.request({ method: 'eth_requestAccounts' })
      if( accounts && accounts.length ){
        //success!
        connectButton.style.display = 'none'
      }
      else{
        //dumb user
        alert( 'Please select an account' )
      }
    })
  }
})()
```

---
## The Code:
```js
//wait for all page resources to load
window.addEventListener( 'DOMContentLoaded', async () => {
  //store this globally
  var accounts = []

  //soft check: do we have permission to get accounts from the wallet?
  const permissions = await top.ethereum.request({ method: 'wallet_getPermissions' })
  const hasAccountsPermission = permissions.some( p => p.parentCapability === 'eth_accounts' )

  //if we have permission, get the account list
  if( hasAccountPermission ){
    accounts = await top.ethereum.request({ method: 'eth_accounts' })
  }

  //if no permissions or no accounts, create a button to request both
  const connectButton = document.getElementById( 'connect-button' )
  if( hasAccountPermission && accounts && accounts.length ){
    connectButton.style.display = 'none'
  }
  else{
    connectButton.style.display = 'inline-block'
    connectButton.addEventListener( 'click', async (e) => {
      //if your button is an anchor <a />, cancel the click event
      if( e.cancelable )
        e.preventDefault()

      //the user clicked our button, so now we can do the hard check
      accounts = await top.ethereum.request({ method: 'eth_requestAccounts' })
      if( accounts && accounts.length ){
        //success!
        connectButton.style.display = 'none'
      }
      else{
        //dumb user
        alert( 'Please select an account' )
      }
    })
  }
})
```

---
## References:
- [MetaMask: The Ethereum Provider](https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents)
- [MDN: window.top](https://developer.mozilla.org/en-US/docs/Web/API/Window/top)
