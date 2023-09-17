import { Avatar, Box, Card, CardHeader, Divider, Text } from "@chakra-ui/react";
import ChatInput from "../chatInput";
import Messages from "../messages";
import { useContext, useEffect } from "react";
import { ChatContext } from "@/context/ChatContext";

export default function Chatbox() {
  const { data } = useContext(ChatContext);

  console.log("daaaa", data);
  return (
    <>
      <Card w={"100%"} m={5}>
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
        {data.chatId && (
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
        )}
      </Card>
    </>
  );
}
