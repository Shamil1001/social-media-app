import { Avatar, Box } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { auth } from "../../../firebase";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "@/context/ChatContext";
import Image from "next/image";

export default function Message({ message }: any) {
  const currentUser: any = auth.currentUser;
  const { data } = useContext(ChatContext);

  const ref = useRef<any>();

  useEffect(() => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  return (
    <>
      <div
        ref={ref}
        className={
          message.senderId === currentUser?.uid
            ? "w-full chat chat-end"
            : "w-full chat chat-start"
        }
      >
        <div className="chat-image avatar">
          <Avatar
            name={
              message.senderId === currentUser?.uid
                ? currentUser?.displayName
                : data.user.displayName
            }
            src={
              message.senderId === currentUser?.uid
                ? currentUser?.photoUrl
                : data.user.photoURL
            }
          />
        </div>
        <div className="chat-header">
          {/* <Text className="text-xs opacity-50">{message.date}</Text> */}
        </div>
        <div className="chat-bubble">
          {message.text}
          {message.img && (
            <Image alt="imgg" width={30} height={30} src={message.img} />
          )}
        </div>
      </div>
    </>
  );
}
