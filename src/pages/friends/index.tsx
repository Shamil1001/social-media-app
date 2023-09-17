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
import { onSnapshot, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";

export default function Chat() {
  const [friends, setFriends] = useState<any>();
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
            return { ...setFriends, user: item.data() };
          });
        setFriends(filteredSidebarUser);
        console.log("sidebar", friends);
      }),

    [db]
  );

  return (
    <>
      <Box w={"100%"} h={"100vh"} className="flex justify-center">
        <Card variant={"outline"} className="w-[50%] m-5" minW={"300px"}>
          <CardHeader className="text-lg font-bold">My friends</CardHeader>
          <Divider />
          <CardBody className="flex flex-col gap-3">
            {friends &&
              friends.map((item: any) => (
                <>
                  <Card variant={"filled"}>
                    <Box className="flex flex-row items-center justify-between h-24 p-2 rounded-md ">
                      <Box
                        // onClick={() => handleSelect(item.user)}
                        className="flex flex-row items-center gap-2 cursor-pointer"
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
                      <Button colorScheme="blue">Follow</Button>
                    </Box>
                  </Card>
                </>
              ))}
          </CardBody>
        </Card>
      </Box>
    </>
  );
}
