import { Box, Card } from "@chakra-ui/react";

import { auth, db } from "../../../firebase";
import { Avatar } from "@chakra-ui/react";
import {
  onSnapshot,
  collection,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "@/context/ChatContext";

export default function Sidebar() {
  const currentUser = auth.currentUser;
  const [sidebarUser, setSidebarUsers] = useState<any>();

  const { dispatch } = useContext(ChatContext);

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const currentUser = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == auth.currentUser?.uid;
        });
        const filteredSidebarUser = snapshot.docs
          .filter((doc: any) => {
            return currentUser[0].data().following.includes(doc.data().uid);
          })
          .map((item: any) => {
            return { ...sidebarUser, user: item.data() };
          });
        setSidebarUsers(filteredSidebarUser);
        console.log("sidebarrr", filteredSidebarUser);
      }),

    [db]
  );

  const handleSelect = async (user: any) => {
    const combinedUid =
      currentUser?.uid > user.uid
        ? currentUser?.uid + user.uid
        : user.uid + currentUser?.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedUid));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedUid), { messages: [] });

        await updateDoc(doc(db, "userChats", `${currentUser?.uid}`), {
          [combinedUid + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoUrl: user.photoUrl,
          },
          [combinedUid + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", `${user.uid}`), {
          [combinedUid + ".userInfo"]: {
            uid: currentUser?.uid,
            displayName: currentUser?.displayName,
            photoUrl: currentUser?.photoUrl,
          },
          [combinedUid + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log(err);
    }
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <>
      <Card
        w={"20%"}
        h={"88vh"}
        p={3}
        className="flex flex-col gap-6"
        rounded={"0px"}
      >
        {sidebarUser &&
          sidebarUser.map((item: any) => (
            <>
              <Box
                onClick={() => handleSelect(item.user)}
                className="flex flex-row items-center gap-2 p-2 rounded cursor-pointer hover:bg-slate-700"
              >
                <Avatar
                  name={item.user.displayName}
                  size={"sm"}
                  src={`${item.user.photoUrl}`}
                />
                <Box>{item.user.displayName}</Box>
              </Box>
            </>
          ))}
      </Card>
    </>
  );
}
