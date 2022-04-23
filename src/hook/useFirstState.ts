import { useRef } from "react";

function useFirstState() {
  const _refFirst = useRef(true);
  if (_refFirst.current) {
    _refFirst.current = false;
    return true;
  }
  return false;
}

export default useFirstState;
