import React, { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const PaymentModal = ({ course, onClose }) => {
  const [wallet, setWallet] = useState(null);
  const [walletName, setWalletName] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const SOLANA_NETWORK = "https://api.devnet.solana.com";
  const connection = new Connection(SOLANA_NETWORK, "confirmed");

  const RECIPIENT_ADDRESS = "5mxX4YvebJv8SC3Fk52DYV7vnAkn8ZYtHAWMZ2xt4Toq";

  useEffect(() => {
    const detectWallet = () => {
      if ("solana" in window) {
        const provider = window.solana;

        if (provider?.isPhantom) return { provider, name: "Phantom" };
        if (provider?.isSolflare) return { provider, name: "Solflare" };
        if (provider?.isBackpack) return { provider, name: "Backpack" };
        if (provider?.connect) return { provider, name: "Solana Wallet" };
      }
      return null;
    };

    const info = detectWallet();

    if (info) {
      setWallet(info.provider);
      setWalletName(info.name);

      if (info.provider.isConnected && info.provider.publicKey) {
        setWalletAddress(info.provider.publicKey.toString());
      }
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window?.solana)
        throw new Error("Install Phantom / Solflare / Backpack wallet");

      const provider = window.solana;
      const name = provider.isPhantom
        ? "Phantom"
        : provider.isSolflare
        ? "Solflare"
        : provider.isBackpack
        ? "Backpack"
        : "Solana Wallet";

      setWallet(provider);
      setWalletName(name);

      await provider.connect();

      if (!provider.publicKey)
        throw new Error("Wallet returned no public key");

      setWalletAddress(provider.publicKey.toString());
    } catch (error) {
      setError(error.message);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (wallet) await wallet.disconnect();
      setWalletAddress(null);
    } catch {}
  };

  const sendPayment = async () => {
    try {
      setError("");

      if (!wallet) throw new Error("Wallet not detected");

      await wallet.connect();

      if (!wallet.publicKey)
        throw new Error("Wallet did not provide a public key");

      const fromPublicKey = wallet.publicKey;
      const recipientPublicKey = new PublicKey(RECIPIENT_ADDRESS);

      if (!course?.fee) throw new Error("Invalid course fee");

      // Devnet payment conversion
      const solAmount = course.fee * 0.1;
      const lamports = solAmount * LAMPORTS_PER_SOL;

      const { blockhash } = await connection.getLatestBlockhash();

      const transaction = new Transaction({
        feePayer: fromPublicKey,
        recentBlockhash: blockhash,
      }).add(
        SystemProgram.transfer({
          fromPubkey: fromPublicKey,
          toPubkey: recipientPublicKey,
          lamports,
        })
      );

      // sign + send (recommended)
      const result = await wallet.signAndSendTransaction(transaction);

      const signature =
        result.signature || result; // some wallets return string directly

      await connection.confirmTransaction(signature, "confirmed");

      // verify with backend
      await axios.post(
        `${BASE_URL}/course/verify-payment`,
        {
          courseId: course._id?.toString(),
          transactionHash: signature,
          paymentWalletAddress: fromPublicKey.toString(),
        },
        { withCredentials: true }
      );

      onClose();
      navigate(`/course/${course._id}`);

    } catch (err) {
      console.error(err);
      setError(err.message || "Payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-300">Course Fee</p>
          <p className="text-3xl font-bold text-white">${course?.fee}</p>
        </div>

        {!walletAddress ? (
          <button
            onClick={connectWallet}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
          >
            Connect Solana Wallet
          </button>
        ) : (
          <>
            <div className="bg-gray-700 p-3 rounded-lg mb-4 text-white text-sm">
              Connected Wallet: {walletName}
              <br />
              <span className="text-xs">{walletAddress}</span>
            </div>

            <button
              onClick={() => {
                setIsProcessing(true);
                sendPayment();
              }}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 py-3 text-white font-semibold rounded-lg"
            >
              {isProcessing ? "Processing..." : "Pay & Confirm"}
            </button>

            <button
              onClick={disconnectWallet}
              className="w-full bg-gray-600 hover:bg-gray-700 py-2 text-white rounded-lg mt-3"
            >
              Disconnect Wallet
            </button>
          </>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-900/40 border border-red-600 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-900/40 border border-blue-600 rounded-lg">
          <p className="text-blue-300 text-xs">
            ⚠️ Devnet transaction — No real money involved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
