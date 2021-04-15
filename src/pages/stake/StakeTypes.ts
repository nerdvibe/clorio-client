export interface INonceDelegateQueryResult {
  accountByKey: {
    delegate: {
      publicKey: string;
      name: string;
    };
    usableNonce: number;
  };
}
