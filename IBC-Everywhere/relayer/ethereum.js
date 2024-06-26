const Web3 = require('web3');
const config = require('./config');

const web3 = new Web3(config.ethRpcUrl);

const subscribeToEvents = async (handleEvent) => {
    const ethContract = new web3.eth.Contract(config.ethAbi, config.ethContractAddress);
    ethContract.events.MyEvent({}, async (error, event) => {
        if (error) console.error("Error on Ethereum event", error);
        else handleEvent(event);
    });
};

module.exports = {
    subscribeToEvents,
};
