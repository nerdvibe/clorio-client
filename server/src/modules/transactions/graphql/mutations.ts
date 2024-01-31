import {broadcastTx} from "@modules/graphqlProxy";
import {broadcastDelegation} from "@modules/graphqlProxy/lib/broadcastDelegation";
import {sendGraphqlError} from "../../../graphql/util";
const {
    ApolloError,
} = require('apollo-server');

export interface SignatureInput {
    rawSignature: string;
    scalar: string;
    field: string;
}

export interface SendPaymentInput {
    nonce: string;
    memo: string;
    validUntil: string;
    fee: string;
    amount: string;
    token: string;
    to: string;
    from: string;
}

export interface SendDeleagationInput {
    nonce: string;
    memo: string;
    validUntil: string;
    fee: string;
    to: string;
    from: string;
}

interface BroadcastTransaction {
    signature: SignatureInput;
    input: SendPaymentInput;
}
interface BroadcastDelegation {
    signature: SignatureInput;
    input: SendDeleagationInput;
}

export const mutations = {
    broadcastTransaction: async({signature, input}: BroadcastTransaction) => {
        try {
            return await broadcastTx(signature, input);
        } catch(e) {
            sendGraphqlError(e)
        }
    },

    broadcastDelegation: async({signature, input}: BroadcastDelegation) => {
        try {
            return await broadcastDelegation(signature, input);
        } catch(e) {
             sendGraphqlError(e)
        }
    },
};
