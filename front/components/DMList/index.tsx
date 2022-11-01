import React, { useCallback, useEffect, useState } from 'react';
import { DMType, UserType, UserWithOnlineType } from '@typings/db';
import { useParams } from 'react-router';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { CollapseButton } from '@components/DMList/styles';
import { NavLink } from 'react-router-dom';

interface PropsType {
  userData: UserType;
}

const DMList = ({ userData }: PropsType) => {
  const { workspace } = useParams();
  const { data: memberData } = useSWR<UserWithOnlineType[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState<{ [key: string]: number }>({});
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
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

  const onMessage = (data: DMType) => {
    setCountList((list) => {
      return {
        ...list,
        [data.SenderId]: list[data.SenderId] ? list[data.SenderId] + 1 : 1,
      };
    });
  };

  useEffect(() => {
    setOnlineList([]);
    setCountList({});
  }, [workspace]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {channelCollapse
          ? null
          : memberData?.map((member) => {
              const isOnline = onlineList.includes(member.id);
              const count = countList[member.id] || 0;
              return (
                <NavLink
                  key={member.id}
                  className={({ isActive }) => (isActive ? 'selected' : undefined)}
                  to={`/workspaces/${workspace}/dm/${member.id}`}
                  onClick={resetCount(member.id)}
                >
                  <i />
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
