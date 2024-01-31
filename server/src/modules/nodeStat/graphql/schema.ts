import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type NodeInfo {
      height: Int
      syncStatus: String
      chainId: String
      name: String
      version: Int
      network: String
    }

  type Query {
    nodeInfo: NodeInfo
  }
`);
