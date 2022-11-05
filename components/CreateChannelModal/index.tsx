import React, { useCallback } from 'react';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { toast, ToastContainer } from 'react-toastify';
import useInput from '@hooks/useInput';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../Modal';
import useSWR from 'swr';
import { ChannelType } from '@typings/db';
import axios from 'axios';
import { useParams } from 'react-router';
import fetcher from '@utils/fetcher';

interface PropsType {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseModal: () => void;
}

const CreateChannelModal = ({ show, setShow, onCloseModal }: PropsType) => {
  const { workspace } = useParams();
  const { mutate } = useSWR<ChannelType[]>(`/api/workspaces/${workspace}/channels`, fetcher);

  const [newChannel, onChangeNewChannel] = useInput();
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      axios
        .post(
          `/api/workspaces/${workspace}/channels`,
          {
            name: newChannel,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          mutate();
          setShow(false);
        })
        .catch((error) => {
          console.log(error.response);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [workspace, newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onSubmit}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="workspace" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
      <ToastContainer />
    </Modal>
  );
};

export default CreateChannelModal;
