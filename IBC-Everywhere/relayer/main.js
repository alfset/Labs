const { subscribeToEvents } = require('./ethereum');
const { sendSolanaTransaction } = require('./solana');
const { sendCosmosTransaction } = require('./cosmos');

const handleEvent = async (event) => {
    console.log("Event received:", event);
    await sendSolanaTransaction();
    await sendCosmosTransaction();
};

const init = async () => {
    await subscribeToEvents(handleEvent);
};

init();
