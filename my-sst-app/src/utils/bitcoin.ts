import * as bitcore from "bitcore-lib";
import axios from "axios";

export async function createOpReturnTransaction(data: string, privateKeyWIF?: string) {
  const privateKey = privateKeyWIF ? new bitcore.PrivateKey(privateKeyWIF, bitcore.Networks.testnet) : new bitcore.PrivateKey();
  const address = privateKey.toAddress();

  // Known testnet address with UTXOs
  const testnetAddress = "n4VQ5YdHf7hLQ2gWQYYrcxoE5B7nWuDFNF";

  try {
    // Fetch UTXO from BlockCypher testnet API
    const utxoResponse = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${testnetAddress}?unspentOnly=true`);
    console.log('UTXO Response:', utxoResponse.data);

    if (!utxoResponse.data.txrefs) {
      console.error('No UTXO references found in the response:', utxoResponse.data);
      throw new Error('No UTXO references found in the response');
    }

    // Use txrefs to build UTXOs
    const utxos = utxoResponse.data.txrefs.map((ref: any) => ({
      txId: ref.tx_hash,
      outputIndex: ref.tx_output_n,
      address: testnetAddress,
      script: bitcore.Script.buildPublicKeyHashOut(address).toHex(),
      satoshis: ref.value,
    }));

    if (utxos.length > 0) {
      const unspentOutput = new bitcore.Transaction.UnspentOutput(utxos[0]);

      console.log('Unspent Output:', unspentOutput);

      const transaction = new bitcore.Transaction()
        .from([unspentOutput]) // Wrap unspentOutput in an array
        .addData(Buffer.from(data, 'utf8')) // Ensure Buffer.from() is used correctly
        .change(address)
        .sign(privateKey);

      console.log('Transaction:', transaction.toString());

      return transaction;
    } else {
      throw new Error('No UTXOs available for the provided address.');
    }
  } catch (error) {
    console.error('Error fetching UTXO:', error);
    throw error;
  }
}
