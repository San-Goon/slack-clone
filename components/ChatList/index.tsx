import React, { forwardRef, useCallback } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { DMType } from '@typings/db';
import Chat from '../Chat';
import { positionValues, Scrollbars } from 'react-custom-scrollbars';

interface PropsType {
  chatSections: { [key: string]: DMType[] };
  setSize: (size: number | ((_size: number) => number)) => Promise<DMType[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, PropsType>(({ chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
  const onScroll = useCallback((values: positionValues) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      setSize((prevSize) => prevSize + 1).then(() => {});
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
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
});

export default ChatList;
