import {
  Modal,
  Button,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState } from "react";

export default function CommentModal({
  isOpen,
  onClose,
  handleDeletePost,
  selectedPostId,
}: any) {
  const OverlayTwo = () => (
    <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
  );

  const [overlay, setOverlay] = useState(<OverlayTwo />);

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Delete modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Are you sure to delete this post?</p>
          </ModalBody>
          <ModalFooter className="flex flex-row gap-5">
            {/* <p>{selectedPostId}</p> */}
            <Button onClick={() => handleDeletePost(selectedPostId)}>
              Yes
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
