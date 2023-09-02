import { Box, Card, Divider } from "@chakra-ui/react";
import ChatInput from "../chatInput";
import Messages from "../messages";

export default function Chatbox() {
  return (
    <>
      <Card w={"100%"} m={5}>
        <Box p={5}>SHamil</Box>
        <Divider />
        <Box className="h-[calc(100%-120px)]" p={5}>
          <Messages />
        </Box>
        <ChatInput />
      </Card>
    </>
  );
}
