import React, { FC, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace: FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { data, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  return (
    <div>
      {data ? (
        <>
          <Header>
            <RightMenu>
              <span onClick={onClickUserProfile}>
                <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
                {showUserMenu ? (
                  <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onClickUserProfile}>
                    <ProfileModal>
                      <img src={gravatar.url(data.email, { s: '36px', d: 'retro' })} alt={data.nickname} />
                      <div>
                        <span id="profile-name">{data.nickname}</span>
                        <span id="profile-active">Active</span>
                      </div>
                    </ProfileModal>
                    <LogOutButton onClick={onClickLogout}>로그아웃</LogOutButton>
                  </Menu>
                ) : null}
              </span>
            </RightMenu>
          </Header>
          <WorkspaceWrapper>
            <Workspaces>test</Workspaces>
            <MenuScroll>menu scroll</MenuScroll>
            <Channels>
              <WorkspaceName>Slack</WorkspaceName>
            </Channels>
            <Chats>
              <Routes>
                <Route path="/workspace/channel" element={<Channel />} />
                <Route path="/workspace/dm" element={<DirectMessage />} />
              </Routes>
            </Chats>
          </WorkspaceWrapper>
        </>
      ) : null}
      {children}
    </div>
  );
};

export default Workspace;
