import React, { useCallback, useRef } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { DMType } from '@typings/db';
import Chat from '../Chat';
import { Scrollbars } from 'react-custom-scrollbars';

interface PropsType {
  chatSections: { [key: string]: DMType[] };
}

const ChatList = ({ chatSections }: PropsType) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => {
                return <Chat key={chat.id} data={chat} />;
              })}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
