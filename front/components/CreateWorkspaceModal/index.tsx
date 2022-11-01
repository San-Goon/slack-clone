import React, { useCallback } from 'react';
import Modal from '@components/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import useInput from '@hooks/useInput';
import { KeyedMutator } from 'swr';
import { UserType } from '@typings/db';
import 'react-toastify/dist/ReactToastify.css';

interface PropsType {
  mutate: KeyedMutator<false | UserType>;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseModal: () => void;
}

export const CreateWorkspaceModal = ({ mutate, show, setShow, onCloseModal }: PropsType) => {
  const [newWorkspace, onChangeNewWorkspace] = useInput();
  const [newUrl, onChangeNewUrl] = useInput();

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;
      if (!newWorkspace) return;
      axios
        .post(
          'http://localhost:3095/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
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
    [newWorkspace, newUrl],
  );
  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onSubmit}>
        <Label id="workspace-label">
          <span>워크스페이스 이름</span>
          <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
        </Label>
        <Label id="workspace-url-label">
          <span>워크스페이스 url</span>
          <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
      <ToastContainer />
    </Modal>
  );
};

export default CreateWorkspaceModal;
