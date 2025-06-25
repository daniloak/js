import React from 'react';
import { Container, Footer, Overlay } from './styles';
import Button from '../Button';
import ReactPortal from '../ReactPortal';
import useAnimatedUnmount from '../../hooks/useAnimatedUnmount';

export default function Modal({
  danger = false,
  isLoading = false,
  title,
  children,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  onCancel,
  onConfirm,
  visible,
}) {
  const { shouldRender, animatedElementRef } = useAnimatedUnmount(visible);

  if (!shouldRender) {
    return null;
  }

  return (
    <ReactPortal containerId="modal-root">
      <Overlay ref={animatedElementRef} $isLeaving={!visible}>
        <Container $danger={danger} $isLeaving={!visible}>
          <h1>{title}</h1>
          <div className="modal-body">{children}</div>
          <Footer>
            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </button>
            <Button
              type="button"
              danger={danger}
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmLabel}
            </Button>
          </Footer>
        </Container>
      </Overlay>
    </ReactPortal>
  );
}
