import React, { useCallback, useRef } from 'react';
import { ChatZone } from './styles';
import { DMType } from '@typings/db';
import Chat from '../Chat';
import { Scrollbars } from 'react-custom-scrollbars';

interface PropsType {
  chatData?: DMType[];
}

const ChatList = ({ chatData }: PropsType) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((dm) => (
          <Chat key={dm.id} data={dm} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
