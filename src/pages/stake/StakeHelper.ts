import { IValidatorData } from "./../../components/stake/stakeTableRow/ValidatorDataInterface";
export enum ModalStates {
  PASSPHRASE = "passphrase",
  CONFIRM_DELEGATION = "confirm",
  CUSTOM_DELEGATION = "custom",
  NONCE = "nonce",
  FEE = "fee",
  BROADCASTING = "broadcasting",
}

export const initialDelegateData: IValidatorData = {
  publicKey: "",
};
