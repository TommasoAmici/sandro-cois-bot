export const sortRecord = record => {
  const items = Object.keys(record).map(key => ({
    name: key,
    count: parseInt(record[key]),
  }));
  const itemsSorted = items.sort((a, b) => b.count - a.count);
  return itemsSorted;
};
