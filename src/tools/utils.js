import Big from "big.js";

export function timestampToDate(timestamp) {
  const date_ob = new Date(timestamp);
  const date = ("0" + date_ob.getDate()).slice(-2);
  const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  const year = date_ob.getFullYear();
  const hours = date_ob.getHours();
  const minutes = date_ob.getMinutes();
  const seconds = date_ob.getSeconds();
  const newDate =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return newDate;
}

export function copyToClipboard(content) {
  const el = document.createElement("textarea");
  el.value = content;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

export function loadErrorMessage() {
  document.getElementsByClassName("show-on-load")[0].style = "";
  document.getElementsByClassName("show-on-load")[0].className = "show-mob";
}

export function isEmptyObject(objectToCheck) {
  return (
    objectToCheck &&
    Object.entries(objectToCheck).length === 0 &&
    objectToCheck.constructor === Object
  );
}

export function toNanoMINA(amount) {
  return Big(amount).mul(1e9).toFixed();
}

export function toMINA(amount) {
  return Big(amount).mul(1e-9).toFixed(3);
}

export function getDefaultValidUntilField() {
  return "4294967295";
}
