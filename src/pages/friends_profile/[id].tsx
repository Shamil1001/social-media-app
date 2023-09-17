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

export default function Friends() {
  const selected = useSelector((state: any) => state.friend.selectedFriend);
  const [selectedUser, setSelectedUser] = useState<any>(selected);
  const selectedId = selectedUser.uid;
  const [followStatus, setfollowStatus] = useState({
    status: "unfollowing",
    btnTitle: "Follow",
  });
  const router = useRouter();
  const id = router.query.id;

  // status: "pending",
  //           btnTitle: "Pending",
  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const filteredUser = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == id;
        });
        console.log(filteredUser[0]);
        setSelectedUser(filteredUser[0].data());
        if (
          !selectedUser.followers.includes(currentUser?.uid) &&
          !selectedUser.friendRequests.includes(currentUser?.uid)
        ) {
          setfollowStatus({
            ...followStatus,
            status: "pending",
            btnTitle: "Pending",
          });
        } else if (selectedUser.friendRequests.includes(currentUser?.uid)) {
          setfollowStatus({
            ...followStatus,
            status: "unfollowing",
            btnTitle: "Follow",
          });
        } else {
          setfollowStatus({
            ...followStatus,
            status: "following",
            btnTitle: "Unfollow",
          });
        }
      }),

    [id, followStatus.status]
  );
  const currentUser = auth.currentUser;

  const handleFollow = () => {
    if (selectedUser) {
      if (
        !selectedUser.followers.includes(currentUser?.uid) &&
        !selectedUser.friendRequests.includes(currentUser?.uid)
      ) {
        setfollowStatus({
          ...followStatus,
          status: "pending",
          btnTitle: "Pending",
        });
      } else if (selectedUser.friendRequests.includes(currentUser?.uid)) {
        setfollowStatus({
          ...followStatus,
          status: "unfollowing",
          btnTitle: "Follow",
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
      {selectedUser && (
        <Center py={8}>
          <Box
            maxW={"27%"}
            w={"full"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"2xl"}
            rounded={"md"}
            overflow={"hidden"}
          >
            <Image
              h={"120px"}
              alt="cover-img"
              w={"full"}
              src={
                "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              }
              objectFit={"cover"}
            />
            <Flex justify={"center"} mt={-12}>
              <Avatar
                size={"xl"}
                // src={selectedUser.photoUrl}
                // alt={"Author"}
                css={{
                  border: "2px solid white",
                }}
              />
            </Flex>

            <Box p={6}>
              <Stack spacing={0} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                  {selectedUser.displayName}
                </Heading>
                <Text color={"gray.500"}>
                  {/* @{selectedUser.displayName.toLowerCase()} */}
                </Text>
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
      )}
    </>
  );
}
