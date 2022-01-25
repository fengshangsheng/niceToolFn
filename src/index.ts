const sortFn = (list: number[]) => {
  return list.sort((a, b) => a - b)
}
const addFn = (count: number) => {
  return count + 1;
}
console.log('xxxxx');
console.log(sortFn);
console.log(addFn);

export {
  sortFn,
  addFn
}
