import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Center,
  Divider,
  Text,
} from "@chakra-ui/react";
import ChatInput from "../chatInput";
import Messages from "../messages";
import { useContext, useEffect } from "react";
import { ChatContext } from "@/context/ChatContext";

export default function Chatbox({ setSidebarDisplay }: any) {
  const { data } = useContext(ChatContext);

  return (
    <>
      {data.chatId && (
        <div className="flex items-center justify-center w-full h-full">
          <Card
            boxShadow={"2xl"}
            w={{ base: "80%", md: "60%" }}
            m={5}
            className="mobileM:h-[calc(120vh)] tablet:h-[calc(75vh)] "
          >
            <CardHeader p={3} onClick={() => setSidebarDisplay(true)}>
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
                className="h-[calc(100%)] max-h-[85%] overflow-y-scroll custom-scrollbar"
                p={5}
              >
                <Messages />
              </Box>
              <ChatInput />
            </>
          </Card>
        </div>
      )}
    </>
  );
}
