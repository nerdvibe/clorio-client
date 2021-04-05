import { INetworkData } from "../../models/NetworkData";

export interface IProps {
  accountNumber?: number;
  toggleLoader: () => void;
  network?: INetworkData;
}
