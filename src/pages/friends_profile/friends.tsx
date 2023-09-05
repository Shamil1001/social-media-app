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
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";

export default function Friends() {
  const selectedUser = useSelector((state: any) => state.friend.selectedFriend);
  const selectedId = useSelector((state: any) => state.friend.selectedId);
  const [followStatus, setfollowStatus] = useState("Unfollow");

  const currentUser = auth.currentUser;

  const handleFollow = () => {
    if (selectedUser.followers.includes(currentUser?.uid)) {
      setfollowStatus("Unfollow");
    } else if (selectedUser.friendRequests.includes(currentUser?.uid)) {
      setfollowStatus("Pending");
      handleSendFriendRequest();
    } else {
      setfollowStatus("Follow");
    }
  };

  const handleSendFriendRequest = async () => {
    // setIsSendReq(!isSendReq);
    const requestedId = [...selectedUser.friendRequests, currentUser?.uid];
    console.log("selected", selectedUser);
    await updateDoc(doc(db, "users", `${selectedId}`), {
      friendRequests: requestedId,
    });
  };

  console.log("Friends ", selectedUser);
  return (
    <>
      <Navbar />
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
                src={selectedUser.photoUrl}
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

              {/* {
                selectedUser.followers
               }  */}
              <Button
                w={"full"}
                mt={8}
                // eslint-disable-next-line react-hooks/rules-of-hooks
                bg={useColorModeValue("#151f21", "gray.900")}
                onClick={handleFollow}
                // onClick={() =>
                //   handleSendFriendRequest(auth.currentUser?.uid || "")
                // }
                color={"white"}
                rounded={"md"}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
              >
                {/* {selectedUser.friendRequests.includes(currentUser)
                  ? "Pending"
                  : selectedUser.followers.includes(currentUser)
                  ? "Unfollow"
                  : "Follow"} */}
              </Button>
            </Box>
          </Box>
        </Center>
      )}
      {/* <div>Shamil</div>
      <h2>{selectedUser.displayName}</h2> */}
    </>
  );
}
