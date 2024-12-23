import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQRCode } from "next-qrcode";
const { ethers } = require("ethers");

export default function ClientPage() {
  const [username, setUsername] = useState("");
  const [userAdr, setUserAdr] = useState(null);
  const [userBalance, setUserBalance] = useState("");
  const router = useRouter();
  const { SVG } = useQRCode();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const pkey = localStorage.getItem("pkey");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    async function setupWallet() {
      try {
        // Set up the provider
        const provider = ethers.getDefaultProvider("sepolia", {
          alchemy: "FQLza3Pw812rsFJyGWZvPsJXGzRvnWNv",
        });

        // Create the wallet
        const walletInstance = new ethers.Wallet(pkey, provider);

        // Fetch the wallet address and balance
        const address = walletInstance.address;
        const balance = await provider.getBalance(address);

        console.log("Fetched address:", address);
        console.log("Fetched balance:", ethers.formatEther(balance));

        // Update the state
        setUserAdr(address);
        setUserBalance(Number(ethers.formatEther(balance)).toFixed(4));

        console.log("address from setuserar:", userAdr);
        console.log("balance from setbalance:", userBalance);
      } catch (error) {
        console.error("Error setting up wallet:", error);
      }
    }

    setupWallet();
  }, [userAdr]);

  const handleLogout = () => {
    // Clear the session
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("pkey");

    // Redirect to login page
    router.push("/auth/login");
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>Welcome, {username}!</h1>
      <p>Scan Qrcode and transfer funds for your new wallet.</p>
      {userAdr ? (
        <SVG
          text={userAdr}
          options={{
            margin: 2,
            width: 200,
            color: {
              dark: "#581845",
              light: "#f9a798",
            },
          }}
        />
      ) : (
        <p>Loading QR code...</p>
      )}
      <p>{userAdr || "Loading address..."}</p>
      <br />
      <br />
      <button class="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
