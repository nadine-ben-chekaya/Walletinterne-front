const { ethers } = require("ethers");
import { useState, useEffect } from "react";
import { HDNodeWallet } from "ethers";

export default function TransferETH({ pkey }) {
  const [wallet, setWallet] = useState(null);
  const [userAdr, setUserAdr] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [hash, setHash] = useState(null);
  const [txstatus, setTxstatus] = useState(null);

  useEffect(() => {
    setTxstatus(null);
    setHash(null);
    if (!pkey) {
      console.error("Private key is missing.");
      return;
    }

    async function setupWallet() {
      try {
        // Set up the provider
        const provider = ethers.getDefaultProvider("sepolia", {
          alchemy: "FQLza3Pw812rsFJyGWZvPsJXGzRvnWNv",
        });
        let walletInstance;
        // check the pkey type, hash or 12 phrases.
        const words = pkey.trim().split(/\s+/); // Split by spaces
        if (words.length === 12) {
          const walletMnemonic = HDNodeWallet.fromPhrase(pkey);
          //set the provider
          walletInstance = new ethers.Wallet(
            walletMnemonic.privateKey,
            provider
          );
        } else {
          // Create the wallet
          walletInstance = new ethers.Wallet(pkey, provider);
        }

        setWallet(walletInstance);

        // Fetch the wallet address and balance
        const address = walletInstance.address;
        const balance = await provider.getBalance(address);

        setUserAdr(address);
        setUserBalance(Number(ethers.formatEther(balance)).toFixed(4));
      } catch (error) {
        console.error("Error setting up wallet:", error);
      }
    }

    setupWallet();
  }, [pkey]); // Run when `pkey` changes

  async function submit(e) {
    e.preventDefault();
    setHash(null);
    const formData = new FormData(e.target);
    const to = formData.get("address");
    const value = formData.get("value");

    if (!wallet) {
      console.error("Wallet instance is not initialized.");
      return;
    }
    // Transaction details
    const tx = {
      to,
      value: ethers.parseEther(value),
    };

    try {
      // Send the transaction
      const txResponse = await wallet.sendTransaction(tx);
      setHash(txResponse.hash);

      // Wait for the transaction to be mined
      const receipt = await txResponse.wait();
      setTxstatus("Transaction confirmed");
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    <div>
      <p>
        Transfer ETH for account: <strong>{userAdr || "unknown"}</strong> with
        balance: <strong>{userBalance || "unknown"}ETH "Testnet Eth".</strong>
      </p>
      <form onSubmit={submit}>
        <input
          type="text"
          name="address"
          placeholder="Recipient Address (0x...)"
          required
        />
        <br /> <br />
        <input type="text" name="value" placeholder="Amount (ETH)" required />
        <br /> <br />
        <button class="button" type="submit">
          Send
        </button>
      </form>
      {hash && (
        <p>
          Transaction Hash:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Transaction
          </a>
        </p>
      )}
      {txstatus}
    </div>
  );
}
