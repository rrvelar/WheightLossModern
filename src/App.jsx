
import React, { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import abi from "./abi.json";

const CONTRACT_ADDRESS = "0xDe65B2B4558fE18B923D31E96be966b9e3b0Bd";

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ weight: "", steps: "", in: "", out: "", comment: "" });

  const connectWallet = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    setWallet(await signer.getAddress());
    const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
    setContract(contract);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEntry = async () => {
    if (!contract) return;
    await contract.addEntry(
      BigInt(form.weight),
      BigInt(form.steps),
      BigInt(form.in),
      BigInt(form.out),
      form.comment
    );
    loadEntries();
  };

  const loadEntries = async () => {
    if (!contract) return;
    const list = await contract.getEntries(wallet);
    setEntries(list);
  };

  useEffect(() => {
    if (wallet) loadEntries();
  }, [wallet]);

  return (
    <div style={{ fontFamily: "Arial", maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>📘 Weight Loss Diary</h1>
      {!wallet ? (
        <button onClick={connectWallet}>🔑 Connect Wallet</button>
      ) : (
        <p>Wallet: {wallet}</p>
      )}
      <input name="weight" placeholder="Вес (кг)" onChange={handleChange} />
      <input name="steps" placeholder="Шаги" onChange={handleChange} />
      <input name="in" placeholder="Калории (вход)" onChange={handleChange} />
      <input name="out" placeholder="Калории (расход)" onChange={handleChange} />
      <input name="comment" placeholder="Комментарий" onChange={handleChange} />
      <button onClick={addEntry}>➕ Добавить запись</button>
      <h2>🗒️ Записи</h2>
      {entries.length === 0 ? <p>Нет записей.</p> : entries.map((e, i) => (
        <div key={i} style={{ padding: 10, border: "1px solid #ccc", marginTop: 10 }}>
          <p><strong>Дата:</strong> {new Date(Number(e.timestamp) * 1000).toLocaleString()}</p>
          <p><strong>Вес:</strong> {e.weight.toString()} кг</p>
          <p><strong>Шаги:</strong> {e.steps.toString()}</p>
          <p><strong>Калории (вход):</strong> {e.caloriesIn.toString()}</p>
          <p><strong>Калории (расход):</strong> {e.caloriesOut.toString()}</p>
          <p><strong>Комментарий:</strong> {e.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
