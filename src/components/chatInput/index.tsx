import { Box, Button, Input } from "@chakra-ui/react";
import { BsCardImage } from "react-icons/bs";

export default function ChatInput() {
  return (
    <>
      <Box className="flex flex-row gap-3 " p={2}>
        <Input variant="filled" placeholder="Filled" />
        <input type="file" id="file" className="hidden" />
        <label htmlFor="file" className="cursor-pointer">
          <BsCardImage fontSize={30} />
        </label>
        <Button variant="solid" colorScheme="blue">
          Send
        </Button>
      </Box>
    </>
  );
}
