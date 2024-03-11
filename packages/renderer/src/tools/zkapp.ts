export async function getCurrentNetConfig() {
  return base_berkeley_config;
}
/**
 * base info url
 */
export const BASE_INFO_URL = '';

/**
 * gql : get balance , pending tx and broadcast, etc.
 * explorer : target browser for tx
 * tx : get tx
 */
/** main net url  */
export const MainnetUrlConfig = {
  gql: 'https://clorio-mina-main01.clor.io/v1/graphql',
  explorer: 'https://minaexplorer.com',
  tx: 'https://clorio-mina-main01.clor.io/v1/graphql',
};

/**dev net url */
export const DevnetUrlConfig = {
  gql: 'https://clorio-mina-dev01.clor.io/v1/graphql',
  explorer: 'https://devnet.minaexplorer.com',
  tx: 'https://clorio-mina-dev01.clor.io/v1/graphql',
};

/**testworld2.0 net url */
export const Testworld2UrlConfig = {
  gql: 'https://testworldapi.clor.io/graphql',
  explorer: 'https://testworld.minaexplorer.com',
  tx: 'https://testworldapi.clor.io/graphql',
};
/**
 * The current network configuration version number. If cached locally, increase the current version.
 */
export const NET_CONFIG_VERSION = 1038;

/** all network type contain unknown */
export const NET_CONFIG_TYPE = {
  Mainnet: 'mainnet',
  Devnet: 'devnet',
  Berkeley: 'berkeley',
  Testworld2: 'testworld2',
  Unknown: 'unknown',
};
/** main net config */
const base_mainnet_config = {
  netType: NET_CONFIG_TYPE.Mainnet,
  url: MainnetUrlConfig.gql,
  explorer: MainnetUrlConfig.explorer,
  gqlTxUrl: MainnetUrlConfig.tx,
  name: 'Mainnet',
  id: 1,
};
/** dev net config */
const base_dev_config = {
  netType: NET_CONFIG_TYPE.Devnet,
  url: DevnetUrlConfig.gql,
  explorer: DevnetUrlConfig.explorer,
  gqlTxUrl: DevnetUrlConfig.tx,
  name: 'Devnet',
  id: 2,
};
/** berkeley net config */
const base_berkeley_config = {
  chainId:NET_CONFIG_TYPE.Berkeley,
  netType: NET_CONFIG_TYPE.Berkeley,
  // url: BerkeleyUrlConfig.gql,
  // explorer: BerkeleyUrlConfig.explorer,
  // gqlTxUrl: BerkeleyUrlConfig.tx,
  id: 11,
  name: 'Berkeley',
};
/** testworld2 net config */
const base_testworld2_config = {
  netType: NET_CONFIG_TYPE.Testworld2,
  url: Testworld2UrlConfig.gql,
  explorer: Testworld2UrlConfig.explorer,
  gqlTxUrl: Testworld2UrlConfig.tx,
  id: 12,
  name: 'Testworld2',
};
/** unknown net config */
export const BASE_unknown_config = {
  netType: NET_CONFIG_TYPE.Unknown,
};

export const NETWORK_CONFIG_LIST = [
  base_mainnet_config,
  base_dev_config,
  base_berkeley_config,
  base_testworld2_config,
];

/** support network config */
export const NET_CONFIG_MAP = {
  [NET_CONFIG_TYPE.Mainnet]: {
    type_id: '0',
    config: base_mainnet_config,
  },
  [NET_CONFIG_TYPE.Devnet]: {
    type_id: '1',
    config: base_dev_config,
  },
  [NET_CONFIG_TYPE.Berkeley]: {
    type_id: '11',
    config: base_berkeley_config,
  },
  [NET_CONFIG_TYPE.Testworld2]: {
    type_id: '12',
    config: base_testworld2_config,
  },
  [NET_CONFIG_TYPE.Unknown]: {
    type_id: '10999',
    config: BASE_unknown_config,
  },
};

/** not support transaction history */
export const NET_CONFIG_NOT_SUPPORT_TX_HISTORY = [
  // NET_CONFIG_TYPE.Unknown,
  // NET_CONFIG_TYPE.Testworld2,
  // NET_CONFIG_TYPE.Devnet,
];
/** not support stake   */
export const NET_CONFIG_NOT_SUPPORT_STAKING = [
  NET_CONFIG_TYPE.Unknown,
  // NET_CONFIG_TYPE.Devnet,
];

/** the netType that support zkapp */
export const NET_CONFIG_SUPPORT_ZKAPP = [NET_CONFIG_TYPE.Berkeley, NET_CONFIG_TYPE.Testworld2];
