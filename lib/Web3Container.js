import React from 'react'
import getWeb3 from './getWeb3'
import getContract from './getContract'
import contractDefinition from './contracts/TipEscrow.json'
import { Button, CircularProgress } from '@material-ui/core';
import { connectWallet } from "./tipsService";

export default class Web3Container extends React.Component {
  state = { web3: null, accounts: null, contract: null, connected: false, loading: false, walletInstalled: false };

  async setupWeb3() {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()
      const contract = await getContract(web3, contractDefinition)
      this.setState({ web3, accounts, contract })
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
  }

  componentDidMount() {
    this.setState({walletInstalled:this.isWalletInstalled()});
  }

  /**
   * Check if metamask (or browser-based wallet) is installed
   * 
   * @returns whether wallet is installed. If not display a message for user to install
   */
  isWalletInstalled() {
    if (!window.ethereum) return false;
    return true;
  }

  /**
   * This function will connect to the users' web-based ethereum wallet
   */
  async connect() {
    await window.ethereum.enable();
    this.setState({ loading: false, connected: true });
    this.setupWeb3();
    // you would potentially call connectWallet here!
    // connectWallet();
  }

  render() {
    const { web3, accounts, contract, connected, loading, walletInstalled } = this.state;
    if (!walletInstalled) {
      return (
        <div>
          <header>
            <a href="https://metamask.io/">Please install Metamask</a>
          </header>
        </div>
      );
    }
    if (!connected) {
      return (<div>
        <header><CircularProgress style={{ display: loading ? "block" : "none" }} />
          <Button variant="contained" onClick={async e => {
            this.setState({ loading: true });
            this.connect();
          }}>Connect Wallet</Button></header>
      </div>);

    }
    return web3 && accounts
      ? this.props.render({ web3, accounts, contract })
      : this.props.renderLoading()
  }
}
