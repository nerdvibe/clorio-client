export const indexToRender = (
  page: number,
  indexes: number[],
  maxPages: number,
) => {
  const indexToReturn = [];
  let count = 0;
  if (page > 2 && page < indexes.length - 2) {
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
      const tmpFirstIndex = indexes.length - (maxPages - 1);
      while (count < maxPages) {
        indexToReturn.push(tmpFirstIndex + count);
        count++;
      }
    } else {
      const tmpFirstIndex = indexes.length - 4;
      while (count < 5) {
        indexToReturn.push(tmpFirstIndex + count);
        count++;
      }
    }
  }
  return indexToReturn;
};

/**
 * Creates an array of numbers from 1 to n
 * maxPages 10 -> return [1,2,...10]
 */
export const createIndexesArray = (maxPages: number) => {
  const indexes = [];
  for (let i = 1; i <= maxPages; i++) {
    indexes.push(i);
  }
  return indexes;
};
