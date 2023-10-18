import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log({
    provider,
    signer,
    transactionContract,
  });

  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // 새로고침해도 transaction 개수를 유지하기 위해
  // localstorage에 저장해둔다.
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const getAllTransactions = async () => {
    try {
      if (!ethereum)
        return alert("Please install and make account in Metamask");
      const transactionContract = await getEthereumContract();
      const availableTransactions =
        await transactionContract.getAllTransactions();

      console.log("현재까지 발생한 모든 transactions: ", availableTransactions);

      const structuredTransactions = availableTransactions.map(
        (transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          keyword: transaction.keyword,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        })
      );

      console.log("구조 분리한 transaction data: ", structuredTransactions);

      setTransactions(structuredTransactions);
    } catch (error) {
      console.error(error);
      throw new Error("No Ethereum object exist");
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        return alert("Please install metamask");
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      console.log("현재 등록된 계좌:", accounts);

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.error("No accounts found");
      }
    } catch (error) {
      console.error(error);
      throw new Error("No Ethereum object exist");
    }
  };

  const checkIfTransactionsExist = async () => {
    try {
      if (!ethereum) return alert("Please install metamask first");

      const transactionContract = getEthereumContract();
      const transactionCount = await transactionContract.getTransactionCount();

      window.localStorage.setItem("transactionCount", transactionCount);

      console.log(
        "현재까지 transaction이 발생한적이 있는지 체크: ",
        transactionCount
      );
      // transaction이 발생했다면 개수를 구해주기 위해 함수 호출
      getAllTransactions();
    } catch (error) {
      console.error(error);
      throw new Error("No Ethereum object exist");
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        return alert("Plesase install metamask");
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);

      throw new Error("No Ethereum object.");
    }
  };

  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");

      // get the data from the form.
      // after user type addressTo, amount, keyword, message,
      const { addressTo, amount, keyword, message } = formData;

      const transactionContract = getEthereumContract();

      // 사용자가 입력한 0.00001과 같은 가격을 가상 화폐 기준인
      // 16진수로 변환해주어야 한다.
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", // 대략 0.000021 이더리움
            value: parsedAmount._hex, // 0.00001 -> 16진수로 변환한 수
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      console.log(transactionHash);

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      console.log(transactionCount);

      setTransactionCount(transactionCount.toNumber());

      await transactionHash.wait();

      window.location.reload();
    } catch (error) {
      console.error(error);
      throw new Error("No Ethereum object exist");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
