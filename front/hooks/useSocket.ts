import { io, Socket } from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';

const sockets: { [key: string]: Socket } = {};
const useSocket = (workspace?: string) => {
  // 연결을 끊는 함수. 끊지않으면 워크스페이스가 변경되어도 계속 메세지를 받게됨.
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) return [undefined, disconnect];
  // socket.io 를 쓸수 있게하는 함수.
  sockets[workspace] = io(`${backUrl}/ws-${workspace}`);
  // 서버쪽에 이벤트 이름으로 데이터를 보냄 emit으로 보낸다
  sockets[workspace].emit('hello', 'world');
  // 서버쪽에서 프론트로 message라는 이벤트 명으로 데이터를 보내면 리스너로 받는다. on으로 받음
  sockets[workspace].on('message', (data) => {
    console.log(data);
  });

  return [sockets[workspace], disconnect];
};

export default useSocket;
