import { useLocation } from "react-router";
import { INodeInfo } from "../../../models/NetworkData";

/**
 * Return active sidebar item css class if the current label is the same of route
 * @param route string
 * @returns string
 */
export const isRouteActiveClass = (route: string) => {
  const location = useLocation();
  const currentRoute = location.pathname.toLowerCase();
  return currentRoute.includes(route) ? " sidebar-item-container-active" : " ";
};

/**
 * If network data available, return a string containing the network details.
 * @param networkData
 * @returns string
 */
export const renderNetworkLabel = (networkData?: INodeInfo) => {
  if (networkData) {
    return `${networkData.name} | ${networkData.network}`;
  }
  return "Network unavailable";
};
