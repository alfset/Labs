const { Connection, PublicKey, Transaction, sendAndConfirmTransaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const config = require('./config');

const solanaConnection = new Connection(config.solanaRpcUrl);

const sendSolanaTransaction = async () => {
    try {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: new PublicKey(config.solanaKeypair.publicKey),
                toPubkey: new PublicKey('DestinationSolanaPublicKeyHere'),
                lamports: LAMPORTS_PER_SOL // Sending 1 SOL
            })
        );
        await sendAndConfirmTransaction(solanaConnection, transaction, [config.solanaKeypair]);
        console.log("Transaction successful on Solana");
    } catch (error) {
        console.error("Solana transaction error:", error);
    }
};

module.exports = { sendSolanaTransaction };
