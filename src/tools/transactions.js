import { signPayment } from "@o1labs/client-sdk";

export function signTransaction(transactionData, keypair, sender, actualNonce) {
  const { fee, amount, receiverAddress, memo } = transactionData;
  const signedPayment = signPayment(
    {
      from: sender,
      to: receiverAddress,
      amount,
      fee,
      nonce: actualNonce,
      memo,
    },
    keypair
  );
  return signedPayment;
}

export function createSignatureInputFromSignature(signature) {
  return {
    scalar: signature.scalar,
    field: signature.field,
  };
}

export function createPaymentInputFromPayload(payload) {
  return {
    nonce: payload.nonce,
    memo: payload.memo,
    fee: payload.fee,
    amount: payload.amount,
    to: payload.to,
    from: payload.from,
  };
}

export function createDelegationPaymentInputFromPayload(payload) {
  return {
    nonce: payload.nonce,
    fee: payload.fee,
    validUntil: payload.validUntil,
    to: payload.to,
    from: payload.from,
  };
}
