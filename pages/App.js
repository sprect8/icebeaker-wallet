import Web3 from "web3";
import React, { useEffect } from "react";
import style from './App.module.css';
import { Button, Card, CardActions, CardContent, makeStyles, Snackbar, Typography } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

/**
 * Check if metamask (or browser-based wallet) is installed
 * 
 * @returns whether wallet is installed. If not display a message for user to install
 */
function isWalletInstalled() {
  if (!window.ethereum) {
    return false;
  }
  return true;
}

/**
 * Call this function when the user clicks connect wallet. 
 * The workflow for login/registration is to first connect the users' wallet
 * 
 * This function throws an exception if something went wrong, or if the chain id
 * is not Binance Testnet (chainId = 0x61)
 * 
 * @returns selected address (public key) from metamask
 */
async function connect() {
  window.web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
  const chainId = await window.web3.eth.getChainId();
  if (chainId !== 0x61) {
    throw new Error("Chain ID must be set to the BSC TestNet - ChainId 0x61");
  }
  const coinbase = await window.web3.eth.getCoinbase();

  console.log(await window.web3.eth.getBalance(coinbase));
  return coinbase;
}

/**
 * Tip a friend; if the friend has a wallet, tip directly, otherwise
 * hash (sha) their email address and send to escrow service. The friend
 * can claim when they login (will notify them to claim the token)
 * 
 * @param {JSON} friend - JSON object for friend
 * @param {Number} amount - amount of 'eth' to send
 * @param {JSON} token - the token to which to send
 * @param {String} wallet - my wallet to send from
 */
async function tipFriend({ friend, amount, token, wallet }) {
  console.log(amount);
  if (friend.wallet) {
    await window.web3.eth.sendTransaction({
      from: wallet,
      to: friend.wallet,
      value: amount
    });
    console.log("Completed");
    // this function should call update on a database to register
    // that your friend was tipped an amount
    return true;
  }
  else {
    // send to escrow account (smart contract)
    // to be continued
  }
}

/**
 * This is the function that you should have already created which helps to authenticate
 * a user using google login. Please also save the wallet address along with the user details
 * 
 * @param {String} wallet - the wallet address to be saved along with the google email
 */
async function signInWithGoogle({ wallet }) {
  console.log("Sign in completed", wallet);
}

function App() {
  const classes = useStyles();
  const [walletInstalled, setWalletInstalled] = React.useState(false);
  const [wallet, setWallet] = React.useState("");
  const [open, setOpened] = React.useState(false);
  const [inProgress, setInProgress] = React.useState(false);

  useEffect(e => {
    setWalletInstalled(isWalletInstalled());
  });

  if (!walletInstalled) {
    return (
      <div className={style.App}>
        <header className={style.Appheader}>
          <a href="https://metamask.io/">Please install Metamask</a>
        </header>
      </div>
    );
  }
  if (wallet === "") {
    return (
      <div className={style.App}>
        <header className={style.Appheader}>
          <CircularProgress style={{ display: inProgress ? "block" : "none" }} />
          <Button variant="contained" onClick={async e => {
            setInProgress(true);
            setWallet(await connect());
            setInProgress(false);
          }}>Connect Wallet</Button>
        </header>
      </div>
    );
  }
  return (
    <div className={style.App}>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        onClose={e => setOpened(false)}
        message="Successfully sent a tip to your friend"
        key={"topright"}
      />
      <header className={style.Appheader}>
        <CircularProgress style={{ display: inProgress ? "block" : "none" }} />
        <Typography variant="body1">Connected: {wallet}</Typography>
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              A question that your friend asked which is rather informative!
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={async e => {
              const amount = window.prompt("Enter amount of BNB to send");
              if (!amount || amount === "") return;
              setInProgress(true);
              await tipFriend({
                friend: {
                  wallet: "0x8218bC91354b2AB329eCF20B90751Fc9345e8C96", // hard coded value
                  email: "email@email.com",
                },
                amount: window.web3.utils.toWei(amount, "ether"),
                wallet,
              });
              setInProgress(false);
              setOpened(true);
            }}>Tip</Button>
          </CardActions>
        </Card>
        <br />
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Another question that your friend asked which is rather informative!
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="small" onClick={e => alert("To Be Created")}>Tip - Friend does not have Wallet</Button>

          </CardActions>
        </Card>
      </header>
    </div>
  );
}

export default App;
