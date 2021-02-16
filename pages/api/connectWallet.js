/**
 * ConnectWallet is called to link the wallet address of a user to their email address
 * IF the email address link has associated tips, the user will be paid-out the tips and
 * notified of their pending tips
 */

import { resolveWeb3 } from "../../lib/getWeb3";
import getContractInstance from "../../lib/getContract";
import Contract from "../../lib/contracts/TipEscrow.json";

const handler = async (req, res) => {
    // assume that we can get the authenticated email address somehow
    // for my demo, i will supply as argument in the body
    const { email, address } = JSON.parse(req.body); // note email should be authenticated

    console.log(email, address, req.body);

    if ((req.method !== "POST") || !email || !address) {
        res.status(403).json({"result":"failure", "message":"Invalid response"});
        return;
    }

    const Web3 = await resolveWeb3();
    const accounts = await Web3.eth.getAccounts();
    const contractDefinition = await getContractInstance(Web3, Contract);

    const result = await contractDefinition.methods.hasTips(Web3.utils.soliditySha3(email)).call();
    if (result) {
        // claim the tips!
        const result = await contractDefinition.methods.claim(address, Web3.utils.soliditySha3(email)).send({from:accounts[0]});
        res.status(200).json({"result": "Successfully claimed tips as well!"});
        return;
    }
    res.status(200).json({"result":"success", "message": `Registered ${address} to ${email}`});
}

export default handler;