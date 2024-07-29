import { APIGatewayProxyHandler } from "aws-lambda";
import { Client } from "pg";

export const main: APIGatewayProxyHandler = async () => {
  const client = new Client({
    connectionString: "postgresql://postgres:The7wonders!!@alejandropuente-my-sst-app-rds.cluster-c5eg8kkm49qq.us-west-1.rds.amazonaws.com:5432/todos",
    ssl: {
      rejectUnauthorized: false
    }
  });

  await client.connect();

  const res = await client.query('SELECT * FROM todos');
  await client.end();

  return {
    statusCode: 200,
    body: JSON.stringify(res.rows),
  };
};
