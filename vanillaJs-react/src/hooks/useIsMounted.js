import React, { useEffect } from 'react';

export default function useIsMounted() {
  const isMountedRef = React.useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  function getIsMounted() {
    return isMountedRef.current;
  }

  return getIsMounted;
}
