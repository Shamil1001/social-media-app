import { ChatContext } from "@/context/ChatContext";
import { Box, Button, Input } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { BsCardImage } from "react-icons/bs";
import { auth, db, storage } from "../../../firebase";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { error } from "console";
import { FiSend } from "react-icons/fi";

export default function ChatInput() {
  const [text, setText] = useState<any>();
  const [img, setImg] = useState<any>();

  const currentUser = auth.currentUser;
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.log(error);
        },
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
            await updateDoc(doc(db, "chats", `${data.chatId}`), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser?.uid,
                date: Timestamp.now(),
                img: downloadUrl,
              }),
            });
          })
      );
    } else {
      await updateDoc(doc(db, "chats", `${data.chatId}`), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser?.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", `${currentUser?.uid}`), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", `${data.user.uid}`), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  const handlePress = (e: any) => {
    if (e.key == "Enter") {
      handleSend();
    }
  };

  return (
    <>
      <Box className="flex flex-row gap-3 " p={2}>
        <Input
          variant="filled"
          border={"1px"}
          onKeyDown={(e) => handlePress(e)}
          placeholder="Type here..."
          onChange={(e: any) => setText(e.target.value)}
          value={text}
        />
        {/* <input
          type="file"
          id="file"
          className="hidden"
          onChange={(e: any) => setImg(e.target.files[0])}
        />
        <label htmlFor="file" className="cursor-pointer">
          <BsCardImage fontSize={30} />
        </label> */}
        <Button
          variant="solid"
          isDisabled={!text && true}
          colorScheme="blue"
          onClick={handleSend}
        >
          <FiSend />
        </Button>
      </Box>
    </>
  );
}
