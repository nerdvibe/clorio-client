export interface INodeInfo {
  height:number,
  name:string,
  network:string,
  version:number
}

export interface INetworkData {
  nodeInfo:INodeInfo
}
