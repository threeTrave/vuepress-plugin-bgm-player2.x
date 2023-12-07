// 原数组升序
function binary_search(arr, low, high, key) {
  let res = _binary_search(arr, low, high, key);
  // 防止越界
  return res < low ? low : res;
  // return res;
}
function _binary_search(arr, low, high, key) {
  if (low > high) {
    return high;
  }
  let mid = parseInt((low + high) / 2);
  // console.log(`mid: ${mid}`);
  // if (arr[mid] == key) {
  //   return mid;
  // }
  if (arr[mid][0] >= key) {
    return _binary_search(arr, low, mid - 1, key);
  } else if (arr[mid][0] < key) {
    return _binary_search(arr, mid + 1, high, key);
  }
}
// 测试数据
// let args = process.argv.splice(2);
// let key = binary_search(
//   [
//     [0, 1],
//     [2, 1],
//     [3, 1],
//     [3, 1],
//     [6, 1],
//   ],
//   0,
//   4,
//   parseInt(args[0])
// );
// console.log(key);
export { binary_search };
export default binary_search;
