import React, { useCallback } from 'react';
import { Container, Header } from './styles';
import ChatList from '../../components/ChatList';
import ChatBox from '../../components/ChatBox';
import useInput from '../../hooks/useInput';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput();
  console.log('!!!!');
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setChat('');
    },
    [chat],
  );

  return (
    <Container>
      <Header>채널!</Header>
      <ChatList />
      <ChatBox chat={chat} onSubmit={onSubmit} onChangeChat={onChangeChat} />
    </Container>
  );
};

export default Channel;
