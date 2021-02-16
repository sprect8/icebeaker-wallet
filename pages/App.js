import React, { useEffect } from "react";
import style from './App.module.css';
import { Button, Card, CardActions, CardContent, makeStyles, Snackbar, Typography } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import Web3Container from "../lib/Web3Container";
import { getPendingTips, connectWallet } from "../lib/tipsService";

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
 * Tip a friend; if the friend has a wallet, tip directly, otherwise
 * hash (sha) their email address and send to escrow service. The friend
 * can claim when they login (will notify them to claim the token)
 * 
 * @param {JSON} friend - JSON object for friend
 * @param {Number} amount - amount of 'eth' to send
 * @param {JSON} token - the token to which to send
 * @param {String} wallet - my wallet to send from
 */
async function tipFriend({ friend, amount, contract, wallet, web3 }) {
  console.log(amount);
  if (friend.wallet) {
    await web3.eth.sendTransaction({
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
    console.log("No address, so we will send a tip to the escrow service");
    const result = await contract.methods.deposit(web3.utils.soliditySha3(friend.email)).send({ from: wallet, value: amount });
    console.log(result);
  }
}

/**
 * This function is called to simulate registering your wallet ideally you call 
 * this when the user wants to register their wallet; it will also help claim 
 * some tips if they have any 
 * 
 * @param {String} wallet - wallet to be registered
 */
async function registerWalletToClaim(wallet) {
  connectWallet(wallet);
}

function App(props) {
  const classes = useStyles();
  const [wallet, setWallet] = React.useState(props.accounts && props.accounts[0]);
  const [open, setOpened] = React.useState(false);
  const [inProgress, setInProgress] = React.useState(false);

  const [pendingTips, setPendingTips] = React.useState(false);

  useEffect(e => {
    // poll the pending tips
    window.setInterval(async e => {
      const result = await getPendingTips();
      setPendingTips(+result.pending);
    }, 15000);
  });

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
        <Button
          variant="contained"
          style={{ display: pendingTips ? "block" : "none" }}
          onClick={e => registerWalletToClaim(wallet)}>
          Claim your Tips!
        </Button>
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
                amount: props.web3.utils.toWei(amount, "ether"),
                wallet,
                web3: props.web3
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
            <Button size="small" onClick={async e => {
              const amount = window.prompt("Enter amount of BNB to send");
              if (!amount || amount === "") return;
              setInProgress(true);
              await tipFriend({
                friend: {
                  email: "email@email.com",
                },
                amount: props.web3.utils.toWei(amount, "ether"),
                wallet,
                web3: props.web3,
                contract: props.contract
              });
              setInProgress(false);
              setOpened(true);
            }}>Tip - Friend does not have Wallet</Button>
          </CardActions>
        </Card>
      </header>
    </div>
  );
}

const Container = () => {
  return (<Web3Container
    renderLoading={() => <div>Loading Dapp Page...</div>}
    render={({ web3, accounts, contract }) => (
      <App accounts={accounts} contract={contract} web3={web3} />
    )}
  />);
};

export default Container;
