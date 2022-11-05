import React, { useCallback, useEffect, useState } from 'react';
import { DMType, UserType, UserWithOnlineType } from '../../typings/db';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '../../utils/fetcher';
import { CollapseButton } from './styles';
import { NavLink } from 'react-router-dom';
import useSocket from '../../hooks/useSocket';

const DMList = () => {
  const { data: userData } = useSWR<UserType>('/api/users', fetcher);
  const { workspace } = useParams();
  const { data: memberData } = useSWR<UserWithOnlineType[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [DMCollapse, setDMCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number }>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const [socket, disconnect] = useSocket(workspace);

  const toggleDMCollapse = useCallback(() => {
    setDMCollapse((prev) => !prev);
  }, []);

  const resetCount = useCallback(
    (id: number) => () => {
      setCountList((list) => {
        return {
          ...list,
          [id]: 0,
        };
      });
    },
    [],
  );

  const onMessage = useCallback((data: DMType) => {
    setCountList((list) => {
      return {
        ...list,
        [data.SenderId]: list[data.SenderId] ? list[data.SenderId] + 1 : 1,
      };
    });
  }, []);

  useEffect(() => {
    setOnlineList([]);
    setCountList({});
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data: number[]) => {
      setOnlineList(data);
    });
    socket?.on('dm', onMessage);
    return () => {
      socket?.off('dm', onMessage);
      socket?.off('onlineList');
    };
  }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={DMCollapse} onClick={toggleDMCollapse}>
          <i />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {DMCollapse
          ? null
          : memberData?.map((member) => {
              const isOnline = onlineList.includes(member.id);
              const count = countList[member.id] || 0;
              return (
                <NavLink
                  key={member.id}
                  className={({ isActive }) => (isActive ? 'selected' : undefined)}
                  to={`/workspace/${workspace}/dm/${member.id}`}
                  onClick={resetCount(member.id)}
                >
                  <i
                    className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                      isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                    }`}
                    aria-hidden="true"
                    data-qa="presence_indicator"
                    data-qa-presence-self="false"
                    data-qa-presence-active="false"
                    data-qa-presence-dnd="false"
                  />
                  <span className={count > 0 ? 'bold' : undefined}>{member.nickname}</span>
                  {member.id === userData?.id ? <span> (나)</span> : null}
                  {count > 0 ? <span className="count">{count}</span> : null}
                </NavLink>
              );
            })}
      </div>
    </>
  );
};

export default DMList;
