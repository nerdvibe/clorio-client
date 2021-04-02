import { useLocation } from "react-router";
import { INodeInfo } from "../../../models/network-data";

export const checkRoute = (route:string) => {
  const location = useLocation();
  const currentRoute = location.pathname.toLowerCase();
  return currentRoute.includes(route)
    ? " sidebar-item-container-active"
    : " ";
};

export const renderNetwork = (networkData?:INodeInfo) => {
  if (networkData) {
    return `${networkData.name} | ${networkData.network}`
  }
  return "Network unavailable";
};
