export interface ITxFees {
  fast?: number;
  average?: number;
}

export interface IEstimatedFee {
  txFees?: ITxFees;
}

export interface IFeeQuery {
  estimatedFee: IEstimatedFee;
}
