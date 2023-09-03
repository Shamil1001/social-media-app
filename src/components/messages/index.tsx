import { Box } from "@chakra-ui/react";
import Message from "../message";
import { useContext, useState, useEffect } from "react";
import { ChatContext } from "@/context/ChatContext";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export default function Messages() {
  const [messages, setMessages] = useState<any>([]);
  const { data } = useContext(ChatContext);

  const currentUser = auth.currentUser;

  useEffect(
    () =>
      onSnapshot(collection(db, "chats"), (snapshot: any) => {
        const chats = snapshot.docs.filter((doc: any) => {
          return doc.data();
        });
        const filteredMessages = chats.filter((chat: any) => {
          return chat.id.includes(data.chatId);
        });
        // setMessages(filteredId[0].data());
        // console.log("snapshhot", filteredMessages[0].data().messages);
        // console.log(data.chatId);
        setMessages(filteredMessages[0].data().messages);
        // setCurrentDocId(filteredId[0].id);
      }),

    [data.chatId]
  );

  console.log("messagess", messages);
  return (
    <>
      <Box className="flex flex-col gap-5">
        {messages &&
          messages.map((m: any, index: number) => (
            <Message key={index} message={m} />
          ))}
      </Box>
    </>
  );
}
