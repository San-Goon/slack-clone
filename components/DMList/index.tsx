import React, { useCallback, useEffect, useState } from 'react';
import { DMType, UserType, UserWithOnlineType } from '@typings/db';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { CollapseButton } from './styles';
import { NavLink } from 'react-router-dom';
import useSocket from '@hooks/useSocket';
import gravatar from 'gravatar';

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
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {DMCollapse
          ? null
          : memberData?.map((member) => {
              const isOnline = onlineList.includes(member.id);
              const count = countList[member.id] || 0;
              console.log(isOnline, member.id === userData?.id);
              return (
                <NavLink
                  key={member.id}
                  className={({ isActive }) => (isActive ? 'selected' : undefined)}
                  to={`/workspace/${workspace}/dm/${member.id}`}
                  onClick={resetCount(member.id)}
                >
                  <div className="p-channel_sidebar__user_avatar">
                    <span
                      className="c-avatar"
                      data-qa="channel-prefix-im-avatar"
                      style={{ height: '20px', width: '20px' }}
                    >
                      <span className="c-base_icon__width_only_container" style={{ height: '20px', width: '20px' }}>
                        <img
                          src={gravatar.url(member.email, { s: '24px', d: 'retro' })}
                          className="c-base_icon c-base_icon--image"
                          aria-hidden="true"
                          role="img"
                          alt=""
                          style={{ width: '20px' }}
                        />
                      </span>
                    </span>
                    <div className="p-channel_sidebar__user_avatar_presence_bg"></div>
                    <i
                      className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled p-channel_sidebar__presence_icon--on-avatar p-channel_sidebar__presence_icon--on-avatar-border c-presence ${
                        isOnline
                          ? 'c-presence--active c-icon--presence-online'
                          : 'c-presence--away c-icon--presence-offline'
                      }`}
                      //@ts-ignore
                      type={isOnline ? 'presence-online' : 'presence-offline'}
                      title={isOnline ? '온라인' : '자리 비움'}
                      aria-label={isOnline ? '온라인' : '자리 비움'}
                      aria-hidden="false"
                      data-qa="presence_indicator"
                      data-qa-type={isOnline ? 'presence-online' : 'presence-offline'}
                      data-qa-presence-self={member.id === userData?.id ? 'true' : 'false'}
                      data-qa-presence-active={isOnline ? 'true' : 'false'}
                      data-qa-presence-dnd="false"
                    ></i>
                    <i
                      className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled p-channel_sidebar__presence_icon--on-avatar c-presence ${
                        isOnline
                          ? 'c-presence--active c-icon--presence-online'
                          : 'c-presence--away c-icon--presence-offline'
                      }`}
                      //@ts-ignore
                      type={isOnline ? 'presence-online' : 'presence-offline'}
                      title={isOnline ? '온라인' : '자리 비움'}
                      aria-label={isOnline ? '온라인' : '자리 비움'}
                      aria-hidden="false"
                      data-qa="presence_indicator"
                      data-qa-type={isOnline ? 'presence-online' : 'presence-offline'}
                      data-qa-presence-self={member.id === userData?.id ? 'true' : 'false'}
                      data-qa-presence-active={isOnline ? 'true' : 'false'}
                      data-qa-presence-dnd="false"
                    ></i>
                  </div>
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
