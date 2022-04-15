import { CSSProperties, useState } from "react";

type TStatus = number | boolean;

const useTransition = function (status: TStatus, styleList: CSSProperties) {
  const [flag, updateFlag] = useState(status);
  console.log(updateFlag);
  return flag;
}

export default useTransition;

