import { SSTConfig } from "sst";
import MyStack from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "my-sst-app",
      region: "us-west-1",
    };
  },
  stacks(app) {
    app.stack(MyStack);
  }
} satisfies SSTConfig;
