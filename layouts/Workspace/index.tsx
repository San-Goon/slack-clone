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
} from './styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import { ChannelType, UserType } from '@typings/db';
import 'react-toastify/dist/ReactToastify.css';
import CreateChannelModal from '@components/CreateChannelModal';
import CreateWorkspaceModal from '@components/CreateWorkspaceModal';
import { useParams } from 'react-router';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteChannelModal';
import ChannelList from '@components/ChannelList';
import DMList from '@components/DMList';
import useSocket from '@hooks/useSocket';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

const Workspace = () => {
  const { workspace } = useParams();
  const navigate = useNavigate();

  const { data: userData, mutate: mutateUser } = useSWR<UserType | false>('/api/users', fetcher);

  const { data: channelData } = useSWR<ChannelType[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    if (channelData && userData && socket) {
      socket.emit('login', { id: userData.id, channels: channelData.map((data) => data.id) });
    }
  }, [socket, channelData, userData]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [workspace, disconnect]);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  const onClickLogout = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true,
      })
      .then(() => {
        mutateUser(false);
      });
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onClickInviteWorkspace = useCallback(() => {
    setShowInviteWorkspaceModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
    setShowCreateChannelModal(false);
    setShowInviteWorkspaceModal(false);
    setShowInviteChannelModal(false);
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
      {userData && channelData ? (
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
                <ChannelList />
                <DMList />
              </MenuScroll>
            </Channels>
            <Chats>
              <Routes>
                <Route path="/channel/:channel" element={<Channel />} />
                <Route path="/dm/:id" element={<DirectMessage />} />
              </Routes>
            </Chats>
          </WorkspaceWrapper>
          <CreateWorkspaceModal
            show={showCreateWorkspaceModal}
            setShow={setShowCreateWorkspaceModal}
            onCloseModal={onCloseModal}
          />
          <CreateChannelModal
            show={showCreateChannelModal}
            setShow={setShowCreateChannelModal}
            onCloseModal={onCloseModal}
          />
          <InviteWorkspaceModal
            show={showInviteWorkspaceModal}
            setShow={setShowInviteWorkspaceModal}
            onCloseModal={onCloseModal}
          />
          <InviteChannelModal
            show={showInviteChannelModal}
            setShow={setShowInviteChannelModal}
            onCloseModal={onCloseModal}
          />
        </>
      ) : null}
    </div>
  );
};

export default Workspace;
