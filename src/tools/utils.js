import Big from "big.js";
import { ITEMS_PER_PAGE } from "./const";
import html2pdf from "html2pdf.js";

export const copyToClipboard = (content="") => {
  const el = document.createElement("textarea");
  el.value = content;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export const loadErrorMessage = ()  => {
  document.getElementsByClassName("show-on-load")[0].style = "";
  document.getElementsByClassName("show-on-load")[0].className = "show-mob";
}

export const isEmptyObject = (objectToCheck) =>  {
  return (
    objectToCheck &&
    Object.entries(objectToCheck).length === 0 &&
    objectToCheck.constructor === Object
  );
}

export const toNanoMINA = (amount) =>  {
  return Big(amount).mul(1e9).toFixed();
}

export const toMINA = (amount)  => {
  return Big(amount).mul(1e-9).toFixed(3);
}

export const getDefaultValidUntilField = () =>  {
  return "4294967295";
}


/**
 * Get number of table pages
 * @returns Number
 */
export const getTotalPages = (totalItems=0) =>  {
  if (totalItems) {
    const pages = (totalItems / ITEMS_PER_PAGE).toFixed(0);
    if(totalItems%ITEMS_PER_PAGE < 5 && totalItems%ITEMS_PER_PAGE!==0){
      return parseInt(pages) === 0 ? 1 : parseInt(pages)+1;
    }
    return parseInt(pages) === 0 ? 1 : pages;
  }
  return 1;
}

/**
 * Calculate page from offset
 * @param {number} offset 
 * @returns number
 */
export const getPageFromOffset = (offset=0) => {
  return offset / ITEMS_PER_PAGE + 1
}

export const createAndDownloadPDF = () => {
  return new Promise(
    (resolve)=>{
      const elementsToHide = document.getElementsByClassName("no-print");
      const elementInitalState = [];
      for (const el of elementsToHide) {
        elementInitalState.push(el.style.display);
        el.style.display = "none";
      }
      const elementsToShow = document.getElementsByClassName("pdf-only");
      for (const el of elementsToShow) {
        el.style.display = "inline";
      }
      const element = document.getElementById("element-to-print");
      html2pdf()
        .set({
          margin: 20,
          filename: "Clorio-Paperwallet.pdf",
        })
        .from(element)
        .save();
      setTimeout(() => {
        for (const el of elementsToHide) {
          const tmpStyle = elementInitalState.pop();
          el.style.display = tmpStyle;
        }
        for (const el of elementsToShow) {
          el.style.display = "none";
        }
        resolve(true)
      }, 250);
    }
  )
}
