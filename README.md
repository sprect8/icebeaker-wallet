# Getting Started
1. Install Metamask
2. Get some test BNB tokens (follow the following [instructions](https://binancex.dev/blog.html?p=making-the-move-from-ethereum-to-bsc))
3. npm install
4. npm run dev

NOTE: this is the nextjs version of the same code

# UI Walkthrough
Basic UI ... seriously basic UI
1. It will check if you have metamask, if not it will ask you to install
2. Click connect to connect the wallet
3. Click Tip Friend who has a wallet to send some eth (send 0.1). You will send to my wallet [0x8218bC91354b2AB329eCF20B90751Fc9345e8C96](https://testnet.bscscan.com/address/0x8218bc91354b2ab329ecf20b90751fc9345e8c96)
4. Click Tip Friend who doesn't have a wallet and it will deploy the amount you tip into ESCROW [0x98bdde79a19264e01c44fef8b7471210bd7fc802](https://testnet.bscscan.com/address/0x98bdde79a19264e01c44fef8b7471210bd7fc802#internaltx)
5. Once deployed the UI will have a "Claim Tip" button that indicates you have a tip. This works using the current users' email address; hashed, to look up in the smart contract
6. Only the deployer of the contract can access the smart contract to claim the tip. This is done via API call "connectWallet" which will connect a users' wallet to their email address (if not associated) and automatically redeem the tip as well

# APIs and helpers
1. pages/api/tipsPending: call this to find out if there are tips pending for a user's email address. Encourage users to register a wallet
2. pages/api/connectWallet: call this to connect a wallet to a users' email address (if user has not connected yet)
3. lib/tipsService: service from the front end that calls the APIs

# Components
1. Web3Container: self-contained container for web3 services. It will manage the setup of the web3 libraries and connections
2. App.js: most of  the business logic is here

# Process Flow
1. Connect Wallet
2. Tip (with existing wallet)
3. Tip (for claiming)
4. Click Claim (you can claim your own tip)

# Configuration
1. Deploying a new Smart Contract, you need to configure the .secret file in the root directory (with truffle-config.js). This is used to deploy the smart contracts  
   .secret contains the PRIVATE KEY of your wallet
   ```
   > truffle compile
   > truffle migrate --network binance --reset
   ```
   Everything else is managed for you once you deploy it. Make sure the funding account has some BNB
   
2. Configuring the .env.local file  
   BINANCE_ENDPOINT=https://data-seed-prebsc-1-s1.binance.org:8545/  
   BINANCE_SECRET_KEY= your PRIVATE KEY 

