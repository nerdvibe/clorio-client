import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type News {
      id: String!
      title: String!
      subtitle: String!
      version_op: String
      version: String
      link: String
      cta: String
      cta_color: String
    }

    type Query {
      newsHome: [News]
      newsValidators: [News]
    }
`);
