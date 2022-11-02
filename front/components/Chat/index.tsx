import React from 'react';
import { DMType } from '@typings/db';
import { ChatWrapper } from '@components/Chat/styles';
import gravatar from 'gravatar';

interface PropsType {
  data: DMType;
}

const Chat = ({ data }: PropsType) => {
  const user = data.Sender;
  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{data.createdAt.toString()}</span>
        </div>
        <p>{data.content}</p>
      </div>
    </ChatWrapper>
  );
};

export default Chat;
