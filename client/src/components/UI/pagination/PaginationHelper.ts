// TODO : To be cleaned and simplified
/**
 * Generate the array containing the pages based on the current page.
 * Returns an array of at the most 5 elements where the current page is in the central position (if possible).
 * eg. page: 1 maxPages: 1 => [1]
 * eg. page: 2 maxPages: 3 => [1,2,3]
 * eg. page: 1 maxPages: 8 => [1,2,3,4,5]
 * eg. page: 4 maxPages: 8 => [2,3,4,5,6]
 * eg. page: 6 maxPages: 8 => [4,5,6,7,8]
 * @param page number current page
 * @param maxPages number
 * @returns number[]
 */
export const indexToRender = (page: number, maxPages: number) => {
  const indexToReturn = [];
  let count = 0;
  if (page > 2 && page < maxPages - 2) {
    const tmpIndex = page - 2;
    while (count < 5) {
      indexToReturn.push(tmpIndex + count);
      count++;
    }
  } else if (page <= 2) {
    const min = maxPages <= 5 ? maxPages : 5;
    while (count < min) {
      indexToReturn.push(1 + count);
      count++;
    }
  } else {
    if (maxPages <= 5) {
      const tmpFirstIndex = maxPages - (maxPages - 1);
      while (count < maxPages) {
        indexToReturn.push(tmpFirstIndex + count);
        count++;
      }
    } else {
      const tmpFirstIndex = maxPages - 4;
      while (count < 5) {
        indexToReturn.push(tmpFirstIndex + count);
        count++;
      }
    }
  }
  return indexToReturn;
};
