import React, { useCallback } from 'react';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { toast, ToastContainer } from 'react-toastify';
import useInput from '@hooks/useInput';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@components/Modal';
import { KeyedMutator } from 'swr';
import { ChannelType } from '@typings/db';
import axios from 'axios';
import { useParams } from 'react-router';

interface PropsType {
  mutate: KeyedMutator<ChannelType[]>;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseModal: () => void;
}

const CreateChannelModal = ({ mutate, show, setShow, onCloseModal }: PropsType) => {
  const [newChannel, onChangeNewChannel] = useInput();
  const { workspace } = useParams();
  const onCreateChannel = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      axios
        .post(
          `http://localhost:3095/api/workspaces/${workspace}/channels`,
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
    [newChannel],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
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
