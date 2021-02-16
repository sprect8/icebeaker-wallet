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

# Using the code
A fair bit of work to do
1. I assume user registration is done, and a user can start using the app now
2. Capture user email; and when they connect the wallet, also capture their wallet
3. When displaying the message (with tip option), for the user sending the tip, include the wallet
4. If the user doesn't have a wallet, include users' email address but no wallet (I will send to Escrow account)
5. When a user (A) tips another user (B), we record the tip, tip amount, and A tipped B. 
6. When B logs in, if B does not have an account, they can click connect and register. Then they can claim the tip
7. When B logs in, if B has an account, we display the amount tipped and the transaction that it happened on

UI Extensions  
- A button to be added to the screen that will connect a users' wallet and save that wallet to the backend along with user email
- Functionality that will update the backend database when user clicks connect wallet
- Functionality that will allow a user to claim the tip 

Backend Extensions
- Handle cases where the user does not have a wallet, we must send to ESCROW
- Handle complex case when user wants to send ERC20 tokens instead (NOTE: this is really hard ... do we do atomic swap against Ethereum Main net, or only coins inside BSC Testnet?)

