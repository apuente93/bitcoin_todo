import { StackContext, Api, RDS } from "sst/constructs";

export default function MyStack({ stack }: StackContext) {
  const rds = new RDS(stack, "RDS", {
    engine: "postgresql13.12",
    defaultDatabaseName: "todos",
    migrations: "src/migrations",
  });

  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        environment: {
          RDS_SECRET_ARN: rds.secretArn,
          RDS_CLUSTER_ARN: rds.clusterArn,
          RDS_DATABASE: "todos",
        },
      },
    },
    routes: {
      "POST /todos": "src/createTodo.main",
      "GET /todos": "src/listTodos.main",
    },
  });

  api.attachPermissions([rds]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
