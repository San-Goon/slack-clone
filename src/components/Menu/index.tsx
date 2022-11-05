import { CloseModalButton, CreateMenu } from './styles';
import React, { CSSProperties, ReactNode, useCallback } from 'react';

interface PropsType {
  children: ReactNode;
  show: boolean;
  onCloseModal: (e: any) => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu = ({ children, style, show, onCloseModal, closeButton = true }: PropsType) => {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton ? <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton> : null}
        {children}
      </div>
    </CreateMenu>
  );
};

export default Menu;
