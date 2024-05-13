const { SigningStargateClient, coins } = require('@cosmjs/stargate');
const config = require('./config');

const sendCosmosTransaction = async () => {
    const cosmosClient = await SigningStargateClient.connectWithSigner(config.cosmosRpcUrl, config.cosmosWallet);
    const msg = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: {
            fromAddress: config.cosmosWallet.address,
            toAddress: 'DestinationCosmosAddressHere',
            amount: coins(100, "utoken"),
        },
    };
    const fee = {
        amount: coins(5000, "uatom"),
        gas: "200000",
    };
    try {
        const result = await cosmosClient.signAndBroadcast(config.cosmosWallet.address, [msg], fee);
        console.log("Transaction successful on Cosmos:", result);
    } catch (error) {
        console.error("Cosmos transaction error:", error);
    }
};

module.exports = { sendCosmosTransaction };
