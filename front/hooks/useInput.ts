import React, { useCallback, useState } from 'react';

type ReturnType = [string, (e: React.ChangeEvent<HTMLInputElement>) => void];

const useInput = (): ReturnType => {
  const [state, setState] = useState('');
  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
  }, []);
  return [state, handler];
};

export default useInput;
