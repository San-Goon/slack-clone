import React from 'react';
import { ChatZone, Section } from '@components/ChatList/styles';
import { DMType } from '@typings/db';
import Chat from '@components/Chat';

interface PropsType {
  chatData?: DMType[];
}

const ChatList = ({ chatData }: PropsType) => {
  return (
    <ChatZone>
      {chatData?.map((dm) => (
        <Chat key={dm.id} data={dm} />
      ))}
      <Section>section</Section>
    </ChatZone>
  );
};

export default ChatList;
