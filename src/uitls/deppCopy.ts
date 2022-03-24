function DeepCopy(target: any) {
  const type = Object.prototype.toString.call(target);
  switch (type) {
    case '[object Undefined]':
    case '[object Null]':
    case '[object String]':
    case '[object Number]':
      return target;
    case '[object RegExp]':
      return new RegExp(target);
    case '[object Map]':
      return new Map(target)
    case '[object Date]':
      return new Date(target);
    case '[object Set]':
      return new Set(target);
    case '[object Symbol]':
      return Symbol(target.description);
    case '[object Function]':
      break;
    case '[object Object]':
      break;
    case '[object Array]':
      break;
  }
}

export default DeepCopy;
