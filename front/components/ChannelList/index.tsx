import React, { useCallback, useState } from 'react';
import { ChannelType } from '@typings/db';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { CollapseButton } from '@components/DMList/styles';

interface PropsType {
  channelData: ChannelType[];
}

const ChannelList = ({ channelData }: PropsType) => {
  const { workspace } = useParams();
  const [channelCollapse, setChannelCollapse] = useState(false);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Channels</span>
      </h2>
      <div>
        {!channelCollapse &&
          channelData?.map((channel) => {
            return (
              <NavLink
                key={channel.name}
                className={({ isActive }) => (isActive ? 'selected' : undefined)}
                to={`/workspace/${workspace}/channel/${channel.name}`}
              >
                <span># {channel.name}</span>
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default ChannelList;
