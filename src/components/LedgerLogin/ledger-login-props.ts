import { INetworkData } from "../../models/network-data";

export interface IProps {
  accountNumber?:number,
  setLoader:()=>void,
  network?:INetworkData
}
