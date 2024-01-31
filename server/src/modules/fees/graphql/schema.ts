import { buildSchema } from "graphql";

export const schema = buildSchema(`

  type Fees {
    fast: Float
    average: Float
  }
    
  type SnarkFees {
    maxFee: Float
    minFee: Float
    average: Float
  }
    
  type EstimatedFees {
    txFees: Fees
    snarkFees: SnarkFees
  }

  type Query {
    estimatedFee: EstimatedFees
  }
`);
