import React, { useCallback } from 'react';
import { Container, Header } from '@pages/DirectMessage/styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';

const DirectMessage = () => {
  const { workspace, id } = useParams();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR('/api/users', fetcher);

  const [chat, onChangeChat, setChat] = useInput();

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setChat('');
    },
    [chat],
  );

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData?.email, { s: '24px', d: 'retro' })} alt={userData?.nickname} />
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmit={onSubmit} />
    </Container>
  );
};

export default DirectMessage;
