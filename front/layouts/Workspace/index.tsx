import React, { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { UserType } from '@typings/db';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

interface PropsType {
  children?: React.ReactNode;
}

const Workspace = ({ children }: PropsType) => {
  const { data: userData, mutate } = useSWR<UserType | false>('http://localhost:3095/api/users', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace] = useInput();
  const [newUrl, onChangeNewUrl] = useInput();

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

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(() => {}, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCloseUserProfile = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  useEffect(() => {
    if (!userData) {
      navigate('/login');
    }
  }, [userData, navigate]);

  return (
    <div>
      {userData ? (
        <>
          <Header>
            <RightMenu>
              <span onClick={onClickUserProfile}>
                <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                {showUserMenu ? (
                  <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                    <ProfileModal>
                      <img src={gravatar.url(userData.email, { s: '36px', d: 'retro' })} alt={userData.nickname} />
                      <div>
                        <span id="profile-name">{userData.nickname}</span>
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
            <Workspaces>
              {userData.Workspaces.map((workspace) => {
                return (
                  <Link key={workspace.id} to={`/workspace/${123}/channel/일반`}>
                    <WorkspaceButton>{workspace.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                  </Link>
                );
              })}
              <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
            </Workspaces>
            <Channels>
              <WorkspaceName>Slack</WorkspaceName>
              <MenuScroll>menu scroll</MenuScroll>
            </Channels>
            <Chats>
              <Routes>
                <Route path="/workspace/channel" element={<Channel />} />
                <Route path="/workspace/dm" element={<DirectMessage />} />
              </Routes>
            </Chats>
          </WorkspaceWrapper>
          <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
            <form onSubmit={onCreateWorkspace}>
              <Label id="workspace-label">
                <span>워크스페이스 이름</span>
                <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
              </Label>
              <Label id="workspace-url-label">
                <span>워크스페이스 url</span>
                <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
              </Label>
              <Button type="submit">생성하기</Button>
            </form>
          </Modal>
        </>
      ) : null}
    </div>
  );
};

export default Workspace;
