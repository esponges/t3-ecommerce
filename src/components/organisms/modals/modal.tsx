import { Modal as SemanticModal } from "semantic-ui-react";
import { Button } from "@/components/atoms/button";

interface Props {
  children?: React.ReactNode;
  onClose: () => void;
  open: boolean;
  // onAccept: () => void;
  // acceptText?: string;
  // onReject: () => void;
  title: string;
}  

export const Modal = ({ children, onClose, open, title }: Props) => {
  return (
    <SemanticModal
      onClose={onClose}
      closeIcon
      open={open}
      size="small"
    >
      <SemanticModal.Header>{title}</SemanticModal.Header>
      <SemanticModal.Content>
        {children}
      </SemanticModal.Content>
      <SemanticModal.Actions>
        <Button variant="primary" onClick={onClose}>Cerrar</Button>
      </SemanticModal.Actions>
    </SemanticModal>
  );
};
