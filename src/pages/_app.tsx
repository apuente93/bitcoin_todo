// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;

  // Commented out the fetch functions
  // const fetchTodos = async () => {
  //   const res = await fetch("https://gmelsocha5.execute-api.us-west-1.amazonaws.com/todos");
  //   const data = await res.json();
  //   setTodos(data);
  // };

  // const addTodo = async () => {
  //   await fetch("https://gmelsocha5.execute-api.us-west-1.amazonaws.com/todos", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ todo: newTodo }),
  //   });
  //   setNewTodo("");
  //   fetchTodos();
  // };