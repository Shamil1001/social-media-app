import { Box, Card, Divider } from "@chakra-ui/react";
import ChatInput from "../chatInput";
import Messages from "../messages";
import { useContext } from "react";
import { ChatContext } from "@/context/ChatContext";

export default function Chatbox() {
  const { data } = useContext(ChatContext);
  console.log("daaaa", data);
  return (
    <>
      <Card w={"100%"} m={5}>
        <Box p={5}>{data.user.displayName}</Box>
        <Divider />
        <Box
          className="h-[calc(100%-120px)] max-h-[330px] overflow-y-scroll custom-scrollbar"
          p={5}
        >
          <Messages />
        </Box>
        <ChatInput />
      </Card>
    </>
  );
}
