import {
  Modal,
  Button,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Input,
  FormControl,
} from "@chakra-ui/react";
import { onSnapshot, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";

export default function EditPost({
  isEditOpen,
  onEditClose,
  textValue,
  handleEditPost,
  selectedPostId,
}: any) {
  const OverlayTwo = () => (
    <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
  );

  const [editValue, setEditValue] = useState(textValue);
  const [overlay, setOverlay] = useState(<OverlayTwo />);

  const initialRef = React.useRef(null);

  return (
    <>
      <Modal isCentered isOpen={isEditOpen} onClose={onEditClose}>
        {overlay}
        <ModalContent maxW={{ base: "xs", md: "md" }}>
          <ModalHeader>Edit modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                ref={initialRef}
                value={editValue}
                onChange={(e: any) => setEditValue(e.target.value)}
                placeholder="Write here"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter className="flex flex-row gap-5">
            <Button onClick={() => handleEditPost(editValue)}>Edit</Button>
            <Button onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
