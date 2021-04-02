import { INetworkData } from "../../models/NetworkData";

export interface IProps {
  accountNumber?:number,
  setLoader:()=>void,
  network?:INetworkData
}
