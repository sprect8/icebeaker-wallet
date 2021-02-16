/**
 * ConnectWallet is called to link the wallet address of a user to their email address
 * IF the email address link has associated tips, the user will be paid-out the tips and
 * notified of their pending tips
 */

import { resolveWeb3 } from "../../lib/getWeb3";
import getContractInstance from "../../lib/getContract";
import Contract from "../../lib/contracts/TipEscrow.json";

// Call this to get any pending tips. It should be done when a user logs in
// This will encourage the user to redeem the tips by linking their public key
const handler = async (req, res) => {
    // assume that we can get the authenticated email address somehow
    // for my demo, i will supply as argument in the body
    const { email } = req.query;
    // find the wallet
    const Web3 = await resolveWeb3();

    const contractDefinition = await getContractInstance(Web3, Contract);
    const result = await contractDefinition.methods.hasTips(Web3.utils.soliditySha3(email)).call();

    res.status(200).json({ "pending": result });
}

export default handler;