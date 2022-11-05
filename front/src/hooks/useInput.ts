import React, { useCallback, useState } from 'react';

type ReturnType = [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  React.Dispatch<React.SetStateAction<string>>,
];

const useInput = (): ReturnType => {
  const [state, setState] = useState('');
  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
  }, []);
  return [state, handler, setState];
};

export default useInput;
