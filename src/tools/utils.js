import Big from "big.js";
import { ITEMS_PER_PAGE, MINIMUM_FEE } from "./const";
import { jsPDF } from "jspdf";
import ClorioLogoB64 from "../assets/ClorioLogoB64.json";

export const copyToClipboard = (content = "") => {
  const el = document.createElement("textarea");
  el.value = content;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

export const loadErrorMessage = () => {
  document.getElementsByClassName("show-on-load")[0].style = "";
  document.getElementsByClassName("show-on-load")[0].className = "show-mob";
};

export const isEmptyObject = (objectToCheck) => {
  return (
    objectToCheck &&
    Object.entries(objectToCheck).length === 0 &&
    objectToCheck.constructor === Object
  );
};

export const toNanoMINA = (amount) => {
  return Big(amount).mul(1e9).toFixed();
};

export const toMINA = (amount) => {
  return Big(amount).mul(1e-9).toFixed(3);
};

export const getDefaultValidUntilField = () => {
  return "4294967295";
};

/**
 * Get number of table pages
 * @returns Number
 */
export const getTotalPages = (totalItems = 0) => {
  if (totalItems) {
    const pages = (totalItems / ITEMS_PER_PAGE).toFixed(0);
    if (totalItems % ITEMS_PER_PAGE < 5 && totalItems % ITEMS_PER_PAGE !== 0) {
      return parseInt(pages) === 0 ? 1 : parseInt(pages) + 1;
    }
    return parseInt(pages) === 0 ? 1 : pages;
  }
  return 1;
};

/**
 * Calculate page from offset
 * @param {number} offset
 * @returns number
 */
export const getPageFromOffset = (offset = 0) => {
  return offset / ITEMS_PER_PAGE + 1;
};

export function toLongMINA(amount) {
  return Big(amount).mul(1e-9).toFixed(9);
}

export const downloadPaperWalletPDF = (publicKey, privateKey) => {
  const doc = new jsPDF();
  doc.addImage(ClorioLogoB64, "PNG", 70, 20);
  doc.setFont("Helvetica");
  doc.setFontSize(10);
  doc.text(
    105,
    65,
    "Access the power of the Mina Protocol Blockchain.",
    "center"
  );
  doc.setFontSize(15);
  doc.text(105, 80, "This is your public key", "center");
  doc.text(105, 90, publicKey, "center");
  doc.text(105, 100, "This is your private key", "center");
  doc.text(105, 110, privateKey, "center");
  doc.setFontSize(20);
  doc.text(20, 140, "What to do now?", "left");
  doc.setFontSize(15);
  doc.text(20, 152, "Never ever give to anybody your private key.", "left");
  doc.setFontSize(10);
  doc.text(
    20,
    160,
    "Whoever has this private key can access the Mina tokens contained in this wallet.",
    "left"
  );
  doc.text(
    20,
    165,
    "Make sure that you store this paper wallet carefully and you make a backup of it.",
    "left"
  );
  doc.text(
    20,
    170,
    "If you loose this credentials there is no way to get them back.",
    "left"
  );
  doc.text(
    20,
    185,
    "By using this software you accept the terms and conditions.",
    "left"
  );
  doc.text(
    20,
    190,
    'This software is provided "as is", without warranty of any kind, express or implied,',
    "left"
  );
  doc.text(
    20,
    195,
    "including but not limited to the warranties of merchantability,",
    "left"
  );
  doc.text(
    20,
    200,
    " fitness for a particular purpose and noninfringement.",
    "left"
  );
  doc.text(
    20,
    205,
    "In no event shall the authors or copyright holders be liable for any claim,",
    "left"
  );
  doc.text(
    20,
    210,
    " damages or other liability, whether in an action of contract, tort or otherwise,",
    "left"
  );
  doc.text(
    20,
    215,
    "arising from, out of or in connection with the software or the use or other dealings in the software.",
    "left"
  );
  doc.setFontSize(10);
  doc.text(
    105,
    290,
    "~Clorio is a wallet offered by Carbonara from WeStake.Club and is not developed by O(1)Labs.",
    "center"
  );
  doc.save("Clorio-Paperwallet.pdf");
};

export const feeGreaterThanMinimum = (fee) => {
  if (fee) {
    const feeToSend = toNanoMINA(fee);
    const feeMinusMinimum = +Big(feeToSend).sub(MINIMUM_FEE);
    if (feeMinusMinimum >= 0) {
      return true;
    }
  }
  return false
}

export const isDevnet = () => {
  return process.env.REACT_APP_NETWORK === 'devnet'
}
