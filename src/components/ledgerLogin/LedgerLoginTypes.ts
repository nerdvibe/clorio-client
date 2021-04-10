import { INetworkData } from "../../types/NetworkData";

export interface IProps {
  accountNumber?: number;
  toggleLoader: () => void;
  network?: INetworkData;
}
