import React, { FC, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Header, ProfileImg, RightMenu } from '@layouts/Workspace/styles';
import gravatar from 'gravatar';

const Workspace: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { data, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const navigate = useNavigate();

  const onClickLogout = useCallback(() => {
    axios
      .post('http://localhost:3095/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutate(false);
      });
  }, []);

  useEffect(() => {
    if (!data) {
      navigate('/login');
    }
  }, [data, navigate]);

  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onClickLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
