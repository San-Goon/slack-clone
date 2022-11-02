import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'https://sleact.nodebird.com';

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  // 연결을 끊는 함수. 끊지않으면 워크스페이스가 변경되어도 계속 메세지를 받게됨.
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) return [undefined, disconnect];

  // socket.io 를 쓸수 있게하는 함수. 재연결 방지를 위해 이프문에 삽입
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }
  return [sockets[workspace], disconnect];
};

export default useSocket;
