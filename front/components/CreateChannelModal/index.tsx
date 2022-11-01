import React, { useCallback } from 'react';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { toast, ToastContainer } from 'react-toastify';
import useInput from '@hooks/useInput';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@components/Modal';
import { KeyedMutator } from 'swr';
import { UserType } from '@typings/db';

interface PropsType {
  mutate: KeyedMutator<false | UserType>;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseModal: () => void;
}

const CreateChannelModal = ({ mutate, show, setShow, onCloseModal }: PropsType) => {
  const [newChannel, onChangeNewChannel] = useInput();
  const onCreateChannel = useCallback(() => {}, []);

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
