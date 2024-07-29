import { APIGatewayProxyHandler } from "aws-lambda";
import { createOpReturnTransaction } from "./utils/bitcoin";
import { Client } from "pg";

export const main: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const { todo, btc, privateKeyWIF } = body;
  
  try {
    const transaction = await createOpReturnTransaction(todo, privateKeyWIF);

    const client = new Client({
      connectionString: "postgresql://postgres:The7wonders!!@alejandropuente-my-sst-app-rds.cluster-c5eg8kkm49qq.us-west-1.rds.amazonaws.com:5432/todos",
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();
    await client.query('INSERT INTO todos (hash, todo, btc, timestamp) VALUES ($1, $2, $3, $4)', [transaction.hash, todo, btc, new Date().toISOString()]);
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ transactionId: transaction.hash }),
    };
  } catch (error) {
    console.error('Error processing transaction:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
