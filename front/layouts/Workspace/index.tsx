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
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { UserType } from '@typings/db';
import 'react-toastify/dist/ReactToastify.css';
import CreateChannelModal from '@components/CreateChannelModal';
import CreateWorkspaceModal from '@components/CreateWorkspaceModal';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace = () => {
  const { data: userData, mutate } = useSWR<UserType | false>('http://localhost:3095/api/users', fetcher);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);

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

  const onClickInviteWorkspace = useCallback(() => {}, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCloseUserProfile = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const toggleWorkspaceModal = useCallback(() => {
    setShowWorkspaceModal((prev) => !prev);
  }, []);

  const onClickAddChannel = useCallback(() => {
    setShowCreateChannelModal(true);
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
              <WorkspaceName onClick={toggleWorkspaceModal}>Slack</WorkspaceName>
              <MenuScroll>
                <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                  <WorkspaceModal>
                    <h2>Slack</h2>
                    <button onClick={onClickInviteWorkspace}>워크스페이스 사용자 초대</button>
                    <button onClick={onClickAddChannel}>채널 만들기</button>
                    <button onClick={onClickLogout}>로그아웃</button>
                  </WorkspaceModal>
                </Menu>
              </MenuScroll>
            </Channels>
            <Chats>
              <Routes>
                <Route path="/workspace/:workspace/channel/:channel" element={<Channel />} />
                <Route path="/workspace/:workspace/dm/:id" element={<DirectMessage />} />
              </Routes>
            </Chats>
          </WorkspaceWrapper>
          <CreateWorkspaceModal
            mutate={mutate}
            show={showCreateWorkspaceModal}
            setShow={setShowCreateWorkspaceModal}
            onCloseModal={onCloseModal}
          />
          <CreateChannelModal
            mutate={mutate}
            show={showCreateChannelModal}
            setShow={setShowCreateChannelModal}
            onCloseModal={onCloseModal}
          />
        </>
      ) : null}
    </div>
  );
};

export default Workspace;
