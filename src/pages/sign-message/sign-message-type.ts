export interface ISignMessage {
  payload: string,
  signature: {
    scalar: string,
    field: string,
  },
  publicKey: string,
}
