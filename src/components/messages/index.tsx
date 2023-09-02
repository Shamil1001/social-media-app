import { Box } from "@chakra-ui/react";
import Message from "../message";

export default function Messages() {
  return (
    <>
      <Box className="flex flex-col gap-5">
        <Message />
        <Message />
        <Message />
        <Message />
        <Message />
      </Box>
    </>
  );
}
