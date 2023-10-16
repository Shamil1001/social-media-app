import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

import Navbar from "@/components/navbar/navbar";
import { useSelector } from "react-redux";
import { auth, db } from "../../../firebase";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface IFollowProps {
  status: string | null;
  btnTitle: string | null;
}

export default function Friends() {
  const selected = useSelector((state: any) => state.friend.selectedFriend);
  const [selectedUser, setSelectedUser] = useState<any>(selected);
  const selectedId = selectedUser.uid;
  const [followStatus, setfollowStatus] = useState<IFollowProps>({
    status: null,
    btnTitle: null,
  });
  const router = useRouter();
  const id = router.query.id;

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const filteredUser = snapshot.docs
          .filter((doc: any) => {
            return doc.data().uid == id;
          })[0]
          .data();
        console.log(filteredUser);
        setSelectedUser(filteredUser);
        filteredUser.friendRequests.includes(currentUser?.uid);
        if (
          filteredUser.followers.includes(currentUser?.uid) ||
          filteredUser.following.includes(currentUser?.uid)
        ) {
          setfollowStatus({
            ...followStatus,
            status: "following",
            btnTitle: "Unfollow",
          });
        } else if (filteredUser.friendRequests.includes(currentUser?.uid)) {
          setfollowStatus({
            ...followStatus,
            status: "pending",
            btnTitle: "Pending",
          });
        } else {
          setfollowStatus({
            ...followStatus,
            status: "unfollowing",
            btnTitle: "Follow",
          });
        }
      }),

    [id]
  );
  const currentUser = auth.currentUser;
  console.log("selecctedUser", selectedUser);
  const handleFollow = () => {
    if (selectedUser) {
      if (
        selectedUser.followers.includes(currentUser?.uid) ||
        selectedUser.following.includes(currentUser?.uid) ||
        selectedUser.friendRequests.includes(currentUser?.uid)
      ) {
        setfollowStatus({
          ...followStatus,
          status: "unfollowing",
          btnTitle: "Follow",
        });
      } else if (
        !selectedUser.followers.includes(currentUser?.uid) ||
        !selectedUser.following.includes(currentUser?.uid) ||
        !selectedUser.friendRequests.includes(currentUser?.uid)
      ) {
        setfollowStatus({
          ...followStatus,
          status: "pending",
          btnTitle: "Pending",
        });
      } else {
        setfollowStatus({
          ...followStatus,
          status: "following",
          btnTitle: "Unfollow",
        });
      }
    }
  };
  console.log("selectedId", selectedId);
  const handleSendFriendRequest = async () => {
    // setIsSendReq(!isSendReq);
    handleFollow();
    if (
      !selectedUser.followers.includes(currentUser?.uid) &&
      !selectedUser.friendRequests.includes(currentUser?.uid)
    ) {
      const requestedId = [...selectedUser.friendRequests, currentUser?.uid];
      await updateDoc(doc(db, "users", `${selectedId}`), {
        friendRequests: requestedId,
      });
    } else if (selectedUser.followers.includes(currentUser?.uid)) {
      const filterFollowers = selectedUser.followers.filter(
        (item: any) => item !== currentUser?.uid
      );
      await updateDoc(doc(db, "users", `${selectedId}`), {
        followers: filterFollowers,
        following: filterFollowers,
      });
    } else {
      const cancelFriendRequest = selectedUser.friendRequests.filter(
        (item: any) => item !== currentUser?.uid
      );
      await updateDoc(doc(db, "users", `${selectedId}`), {
        friendRequests: cancelFriendRequest,
      });
      console.log("selected", cancelFriendRequest);
    }
  };

  console.log("Friends ", selectedUser);
  return (
    <>
      <Navbar />
      {selectedUser && (
        <>
          <Center py={8} h={"85vh"}>
            <Box
              maxW={"35%"}
              w={"full"}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bg={useColorModeValue("white", "gray.800")}
              boxShadow={"2xl"}
              rounded={"md"}
              overflow={"hidden"}
            >
              <Flex justify={"center"} mt={8}>
                <Avatar
                  size={"xl"}
                  src={selectedUser.photoUrl}
                  css={{
                    border: "2px solid white",
                  }}
                />
              </Flex>

              <Box p={6}>
                <Stack spacing={0} align={"center"} mb={5}>
                  <Heading
                    fontSize={"2xl"}
                    fontWeight={500}
                    fontFamily={"body"}
                  >
                    {selectedUser.displayName}
                  </Heading>
                  {selectedUser.first_name && selectedUser.last_name && (
                    <Text color={"gray.500"}>
                      {selectedUser.first_name + " " + selectedUser.last_name}
                    </Text>
                  )}
                  {/* {selectedUser.age && (
                    <Text color={"gray.500"}>{selectedUser.age} years old</Text>
                  )} */}
                </Stack>

                <Stack direction={"row"} justify={"center"} spacing={6}>
                  <Stack spacing={0} align={"center"}>
                    <Text fontWeight={600}>
                      {selectedUser.followers && selectedUser.followers.length}
                    </Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      Followers
                    </Text>
                  </Stack>
                  <Stack spacing={0} align={"center"}>
                    <Text fontWeight={600}>
                      {selectedUser.following && selectedUser.following.length}
                    </Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      Following
                    </Text>
                  </Stack>
                </Stack>

                <Button
                  w={"full"}
                  mt={8}
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  bg={useColorModeValue("#151f21", "gray.900")}
                  // onClick={handleFollow}
                  onClick={handleSendFriendRequest}
                  color={"white"}
                  rounded={"md"}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                >
                  {followStatus.btnTitle}
                </Button>
              </Box>
            </Box>
          </Center>
        </>
      )}
    </>
  );
}
