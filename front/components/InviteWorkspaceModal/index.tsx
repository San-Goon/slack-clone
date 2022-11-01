import React, { useCallback } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import { KeyedMutator } from 'swr';
import { ChannelType } from '@typings/db';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface PropsType {
  mutate: KeyedMutator<ChannelType[]>;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseModal: () => void;
}

const InviteWorkspaceModal = ({ mutate, show, setShow, onCloseModal }: PropsType) => {
  const [newMember, onChangeNewMember] = useInput();
  const { workspace } = useParams();
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) return;
      axios
        .post(`/api/workspaces/${workspace}/members`, {
          email: newMember,
        })
        .then(() => {
          mutate();
          setShow(false);
        })
        .catch((error) => {
          console.log(error.response);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [workspace, newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onSubmit}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
      <ToastContainer />
    </Modal>
  );
};

export default InviteWorkspaceModal;