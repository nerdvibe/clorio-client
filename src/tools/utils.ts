import { VALIDATORS_TABLE_ITEMS_PER_PAGE } from "./const/transactions";
import Big from "big.js";
import {
  DEFAULT_VALID_UNTIL_FIELD,
  TRANSACTIONS_TABLE_ITEMS_PER_PAGE,
  MINIMUM_FEE,
} from "./const";
import { toNanoMINA } from "./mina";
import isElectron from "is-electron";
import { toast } from "react-toastify";
import { UpdateError } from "../components/UI/UpdateError";

export const copyToClipboard = (content = "") => {
  const el = document.createElement("textarea");
  el.value = content.trim();
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

/**
 * Set the class to show the error message "Smaller screen support is coming soon"
 */
export const initHtmlElements = () => {
  document.getElementsByClassName("show-on-load")[0].className = "show-mob";
  const loader = document.getElementById("initial-loader");
  if (loader) {
    loader.style.display = "none";
  }
};

/**
 * Check if the object is empty
 * @param object
 * @returns boolean
 */
export const isEmptyObject = (objectToCheck: any) => {
  return (
    objectToCheck &&
    Object.entries(objectToCheck).length === 0 &&
    objectToCheck.constructor === Object
  );
};

export const toBTC = (amount: number) => {
  return Big(amount).mul(1e-9).toFixed(3);
};

export const getDefaultValidUntilField = () => {
  return DEFAULT_VALID_UNTIL_FIELD;
};

/**
 * Get the number of the transactions table and validators table pages based on the total number of elements
 * @returns Number
 */
export const getTotalPages = (totalItems = 0, transactions = true) => {
  const itemsPerPage = transactions
    ? TRANSACTIONS_TABLE_ITEMS_PER_PAGE
    : VALIDATORS_TABLE_ITEMS_PER_PAGE;
  const halfItemsPerPage = itemsPerPage / 2;
  if (totalItems) {
    const pages = (totalItems / itemsPerPage).toFixed(0);
    if (
      totalItems % itemsPerPage < halfItemsPerPage &&
      totalItems % itemsPerPage !== 0
    ) {
      return parseInt(pages) === 0 ? 1 : parseInt(pages) + 1;
    }
    return parseInt(pages) === 0 ? 1 : pages;
  }
  return 1;
};

/**
 * Calculate page from the offset
 * @param {number} offset
 * @returns number
 */
export const getPageFromOffset = (offset = 0) => {
  return offset / TRANSACTIONS_TABLE_ITEMS_PER_PAGE + 1;
};

/**
 * Check if the fee is greater than the minimum
 * @param fee number
 * @returns boolean
 */
export const feeGreaterThanMinimum = (fee: number) => {
  if (fee) {
    const feeToSend = toNanoMINA(fee);
    const feeMinusMinimum = +Big(feeToSend).sub(MINIMUM_FEE);
    if (feeMinusMinimum >= 0) {
      return true;
    }
  }
  return false;
};

export const isDevnet = () => {
  return process.env.REACT_APP_NETWORK === "devnet";
};

export const electronAlerts = async () => {
  const alerts: string[] = [];

  if (isElectron()) {
    let updateChecked = false;
    // @ts-ignore
    const ipcOn = window.ipcBridge.on;
    // @ts-ignore
    const ipcSend = window.ipcBridge.send;
    ipcSend("CHECK_FOR_UPDATE_PENDING");
    ipcOn("CHECK_FOR_UPDATE_SUCCESS", async (_: any, version: string) => {
      updateChecked = true;
      if (!alerts.includes("CHECK_FOR_UPDATE_SUCCESS")) {
        const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
        if (macosPlatforms.includes(window.navigator.platform)) {
          toast.info(UpdateError({ version }), {
            toastId: "CHECK_FOR_UPDATE_SUCCESS",
            autoClose: 10000,
          });
          alerts.push("CHECK_FOR_UPDATE_SUCCESS");
          alerts.push("UPDATE_ERROR");
          alerts.push("DOWNLOAD_UPDATE_FAILURE");
          alerts.push("DOWNLOAD_UPDATE_SUCCESS");
        } else {
          toast.info(`There is a new release 🎉 v${version}`, {
            toastId: "CHECK_FOR_UPDATE_SUCCESS",
          });
          alerts.push("CHECK_FOR_UPDATE_SUCCESS");
        }
      }
    });
    ipcOn("UPDATE_ERROR", () => {
      if (!alerts.includes("UPDATE_ERROR") && updateChecked) {
        toast.error("There was an error while updating the app", {
          toastId: "UPDATE_ERROR",
        });
        alerts.push("UPDATE_ERROR");
      }
    });
    ipcOn("DOWNLOAD_UPDATE_SUCCESS", () => {
      if (!alerts.includes("DOWNLOAD_UPDATE_SUCCESS")) {
        toast.success("Clorio successfully downloaded", {
          toastId: "DOWNLOAD_UPDATE_SUCCESS",
        });
        alerts.push("DOWNLOAD_UPDATE_SUCCESS");
      }
    });
    ipcOn("DOWNLOAD_UPDATE_FAILURE", () => {
      if (!alerts.includes("DOWNLOAD_UPDATE_FAILURE")) {
        toast.error("There was an error while updating", {
          toastId: "DOWNLOAD_UPDATE_FAILURE",
        });
        alerts.push("DOWNLOAD_UPDATE_FAILURE");
      }
    });
  }
};

export const isChrome =
  /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
