import React, { useCallback } from 'react';
import { CloseModalButton, CreateModal } from './styles';

interface PropsType {
  show: boolean;
  children: React.ReactNode;
  onCloseModal: () => void;
}

const Modal = ({ show, children, onCloseModal }: PropsType) => {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
