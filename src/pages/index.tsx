// src/pages/index.tsx
import { useState, useEffect } from "react";

type Todo = {
  hash: string;
  todo: string;
  timestamp: string;
  btc: string;
};

const Home = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [btc, setBtc] = useState("");
  const [error, setError] = useState("");
  const [btcTouched, setBtcTouched] = useState(false);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const validateBtc = (btc: string) => {
    const btcRegex = /^\d+(\.\d{1,8})?$/;
    return btcRegex.test(btc);
  };

  const handleBtcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBtc(value);
    if (btcTouched && !validateBtc(value)) {
      setError("Invalid BTC amount. Please enter a valid amount with up to 8 decimal places.");
    } else {
      setError("");
    }
  };

  const handleBtcBlur = () => {
    setBtcTouched(true);
    if (!validateBtc(btc)) {
      setError("Invalid BTC amount. Please enter a valid amount with up to 8 decimal places.");
    } else {
      setError("");
    }
  };

  const addTodo = async () => {
    setBtcTouched(true);
    if (!validateBtc(btc)) {
      setError("Invalid BTC amount. Please enter a valid amount with up to 8 decimal places.");
      return;
    }

    setError("");
    const newHash = Math.random().toString(36).substring(2, 15); // Generate a random hash
    const newTimestamp = new Date().toISOString();
    const newTodoItem = { hash: newHash, todo: newTodo, timestamp: newTimestamp, btc };

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodoItem),
    });

    if (res.ok) {
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
      setBtc("");
      setBtcTouched(false);
    } else {
      const errorData = await res.json();
      setError(errorData.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Bitcoin Transaction Todo List</h1>
        <div className="mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="border border-gray-300 p-3 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <div className="relative mb-10">
            <input
              type="text"
              value={btc}
              onChange={handleBtcChange}
              onBlur={handleBtcBlur}
              placeholder="BTC Amount"
              className={`border p-3 w-full rounded focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-blue-600'}`}
            />
            {error && btcTouched && <p className="text-red-500 text-sm mt-4 absolute -bottom-10 left-0">{error}</p>}
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={addTodo}
              className="w-full sm:w-auto bg-blue-500 text-white font-bold p-3 rounded hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Add Todo
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700">Transaction Hash</th>
                <th className="py-3 px-4 text-left text-gray-700">Todo</th>
                <th className="py-3 px-4 text-left text-gray-700">Timestamp</th>
                <th className="py-3 px-4 text-left text-gray-700">BTC</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo) => (
                <tr key={todo.hash} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-gray-800">{todo.hash}</td>
                  <td className="py-3 px-4 text-gray-800">{todo.todo}</td>
                  <td className="py-3 px-4 text-gray-800">{new Date(todo.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-800">{todo.btc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
