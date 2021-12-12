export interface Blacklist {
  blacklistedAddresses: BlacklistedAddress[];
}

export interface BlacklistedAddress {
  __typename: string;
  address: string;
}
