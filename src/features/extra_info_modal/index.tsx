import {
  Modal,
  Button,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Box,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Select,
} from "@chakra-ui/react";
import { DatePicker, DatePickerProps } from "antd";
import { useState } from "react";

export default function ExtraInfoModal({ isOpen, onClose }: any) {
  const OverlayTwo = () => (
    <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
  );

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const [overlay, setOverlay] = useState(<OverlayTwo />);

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>About me</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Text>Age</Text>
              <NumberInput w={150}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
            <Box>
              <Text>Gender</Text>
              <Select placeholder="Male" w={150}>
                <option value="option1">Male</option>
                <option value="option2">Female</option>
              </Select>
            </Box>
            <Box>
              <DatePicker className="absolute" onChange={onChange} />
            </Box>
          </ModalBody>
          <ModalFooter className="flex flex-row gap-5">
            {/* <p>{selectedPostId}</p> */}
            <Button>Yes</Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
