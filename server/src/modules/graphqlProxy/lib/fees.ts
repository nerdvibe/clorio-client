import gql from "graphql-tag";
import { minaNodeClient } from "../minaNodeClient";
import Big from "big.js";
import { fromNanoToMina } from "@modules/minaUtils";
import { FeesAndSnarkFees } from "@modules/cache";

const MINIMUM_FEE = 1000000;

export const fees = async (): Promise<FeesAndSnarkFees> => {
  const { data } = await minaNodeClient.query({
    query: gql`
      query pooledUserCommands {
        pooledUserCommands {
          fee
          feeToken
          kind
        }
      }
    `,
    fetchPolicy: "no-cache",
  });

  // const snarksInPool = data.snarkPool.length;
  // const snarks: number[] = data.snarkPool.reduce((acc, curr) => {
  //     // TODO: Improve consts
  //         acc.push(+(curr.fee));
  //         return acc
  // }, [0]);
  // const averageSnarkNano = !snarksInPool ? 0 : Big(snarks.reduce((acc, curr) => {return acc + curr}, 0)).div(snarksInPool);

  const txInMemPool = data.pooledUserCommands.length;
  const txFees: number[] = data.pooledUserCommands.reduce(
    (acc, curr) => {
      // TODO: Improve consts
      if (curr.feeToken === "1" && curr.kind === "PAYMENT") {
        acc.push(+curr.fee);
        return acc;
      }
      return acc;
    },
    [0]
  );
  const averageFeeNano = !txFees.length
    ? 0
    : Big(
        txFees.reduce((acc, curr) => {
          return acc + curr;
        }, 0)
      ).div(txFees.length);

  const fast =
    Math.max(...txFees) === 0
      ? fromNanoToMina(MINIMUM_FEE)
      : fromNanoToMina(Math.max(...txFees));
  const average =
    +averageFeeNano === 0
      ? fromNanoToMina(MINIMUM_FEE)
      : fromNanoToMina(averageFeeNano);

  return {
    txFees: {
      fast,
      average,
    },
    // snarkFees: {
    //     average: fromNanoToMina(averageSnarkNano),
    //     maxFee: fromNanoToMina(Math.max(...snarks)),
    //     minFee: fromNanoToMina(Math.min(...snarks))
    // }
  };
};
