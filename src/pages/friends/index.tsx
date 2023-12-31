import Navbar from "@/components/navbar/navbar";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Text,
} from "@chakra-ui/react";
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { ChatContext } from "@/context/ChatContext";
import { useRouter } from "next/router";
import { handleSelectUser } from "@/shared/store/friends-store/store";
import { useDispatch } from "react-redux";

export default function Chat() {
  const [friends, setFriends] = useState<any>();
  const currentUser: any = auth.currentUser;
  const { dispatch } = useContext(ChatContext);
  const router = useRouter();
  const [currentUserData, setCurrentUserData] = useState<any>();

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const currentUser = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == auth.currentUser?.uid;
        });
        setCurrentUserData(currentUser[0].data());
        const filteredSidebarUser = snapshot.docs
          .filter((doc: any) => {
            return currentUser[0].data().following.includes(doc.data().uid);
          })
          .map((item: any) => {
            return { ...setFriends, user: item.data() };
          });
        setFriends(filteredSidebarUser);
        console.log("sidebar", friends);
      }),

    [db]
  );

  const dispatcher = useDispatch();

  const handleFriendStatus = async (friend: any) => {
    console.log("friend", friend);
    const updatedFriendData = friend.following.filter(
      (item: any) => item !== currentUser?.uid
    );
    const updatedMyData = currentUserData.following.filter(
      (item: any) => item !== friend?.uid
    );
    await updateDoc(doc(db, "users", `${friend.uid}`), {
      following: updatedFriendData,
    });
    await updateDoc(doc(db, "users", `${currentUser.uid}`), {
      following: updatedMyData,
      followers: updatedMyData,
    });
  };

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
      // console.log("user", combinedUid);
      router.push("chat");
    } catch (err) {
      console.log(err);
    }
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  const handleSelectFriend = (user: any) => {
    dispatcher(handleSelectUser(user));
    console.log(user);
  };

  return (
    <div className="">
      <Navbar />
      <Box
        w={"100%"}
        className="flex justify-center mobileS:h-[calc(100vh-70px)] tablet:h-full"
      >
        <Card
          boxShadow={"2xl"}
          variant={"outline"}
          className="w-[100%] m-5"
          maxW={{ base: "md" }}
          // minW={"400px"}
        >
          <CardHeader className="text-lg font-bold">My friends</CardHeader>
          <Divider />
          <CardBody className="flex flex-col gap-3">
            {friends &&
              friends.map((item: any) => (
                <>
                  <Card variant={"filled"} key={item.user.uid}>
                    <Box className="flex flex-row items-center justify-between h-24 p-2 rounded-md ">
                      <Box
                        flexDirection={{ base: "column", md: "row" }}
                        alignItems={{ md: "center" }}
                        onClick={() => handleSelectFriend(item.user)}
                        className="flex gap-2 cursor-pointer"
                      >
                        <Avatar
                          name={item.user.displayName}
                          size={"md"}
                          src={`${item.user.photoUrl}`}
                        />
                        <Text className="text-[18px] ">
                          {item.user.displayName}
                        </Text>
                      </Box>
                      <Box
                        // display={{ base: "none" }}
                        className="flex flex-row gap-3"
                      >
                        <Button
                          onClick={() => handleSelect(item.user)}
                          colorScheme="blue"
                        >
                          Message
                        </Button>
                        <Button
                          onClick={() => handleFriendStatus(item.user)}
                          colorScheme="blue"
                        >
                          Unfollow
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </>
              ))}
          </CardBody>
        </Card>
      </Box>
    </div>
  );
}
