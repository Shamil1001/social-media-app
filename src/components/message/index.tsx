import { Avatar, Box } from "@chakra-ui/react";
import { auth } from "../../../firebase";
import { useContext } from "react";
import { ChatContext } from "@/context/ChatContext";
import Image from "next/image";

export default function Message({ message }: any) {
  const currentUser: any = auth.currentUser;
  const { data } = useContext(ChatContext);

  console.log(message);
  return (
    <>
      <div
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
        {/* <div className="chat-header">
          <time className="text-xs opacity-50">12:45</time>
        </div> */}
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
