import { Avatar, Box, Card, CardHeader, Divider, Text } from "@chakra-ui/react";
import ChatInput from "../chatInput";
import Messages from "../messages";
import { useContext, useEffect } from "react";
import { ChatContext } from "@/context/ChatContext";

export default function Chatbox() {
  const { data } = useContext(ChatContext);

  console.log("dataa", data);
  return (
    <>
      {data.chatId && (
        <Card w={"60%"} m={5} className="h-[calc(78vh)]">
          <CardHeader p={3}>
            <Box className="flex items-center gap-3">
              <Avatar
                name={data.user.displayName}
                size={"md"}
                src={`${data.user.photoUrl}`}
              />
              <Text className="text-lg font-bold">
                {data.chatId
                  ? data.user.displayName
                  : "Please, select a friend to chat"}
              </Text>
            </Box>
          </CardHeader>
          <>
            <Divider />
            <Box
              className="h-[calc(100%-120px)] max-h-[330px] overflow-y-scroll custom-scrollbar"
              p={5}
            >
              <Messages />
            </Box>
            <ChatInput />
          </>
        </Card>
      )}
    </>
  );
}
