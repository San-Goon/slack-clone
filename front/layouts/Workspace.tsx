import React, { FC, useCallback } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Workspace: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { data, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const navigate = useNavigate();

  const onClickLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate();
      });
  }, []);

  if (!data) {
    navigate('/login');
  }

  return (
    <div>
      <button onClick={onClickLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
