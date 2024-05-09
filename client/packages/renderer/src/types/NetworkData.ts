export interface INodeInfo {
  height: number;
  name: string;
  network: string;
  version: number;
  syncStatus: 'SYNCED' | 'BOOTSTRAPPING' | 'CATCHUP' | 'UNKNOWN';
  chainId: string;
}

export interface INetworkData {
  nodeInfo: INodeInfo;
}
