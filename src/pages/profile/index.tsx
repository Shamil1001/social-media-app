import Navbar from "@/components/navbar/navbar";
import {
  CardBody,
  Card,
  Avatar,
  Textarea,
  Button,
  Text,
  CardHeader,
  Divider,
  Box,
  Stack,
  Heading,
  CardFooter,
  Center,
  Flex,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { onSnapshot, collection } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Profile() {
  const [currentUserData, setCurrentUserData] = useState<any>();

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const filteredUser = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == auth.currentUser?.uid;
        });
        console.log(filteredUser[0].data());
        setCurrentUserData(filteredUser[0].data());
      }),
    []
  );
  return (
    <>
      <Navbar />
      {/* <div className="flex justify-center mt-5"> */}
      {currentUserData && (
        <Center>
          <Box
            maxW={"40%"}
            marginTop={"10"}
            w={"full"}
            h={"75vh"}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"2xl"}
            rounded={"md"}
            overflow={"hidden"}
          >
            <Image
              h={"130px"}
              alt="cover-img"
              w={"full"}
              src={
                "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              }
              objectFit={"cover"}
            />
            <Flex justify={"center"} mt={-16}>
              <Avatar
                size={"2xl"}
                src={currentUserData.photoUrl}
                // alt={"Author"}
                css={{
                  border: "2px solid white",
                }}
              />
            </Flex>

            <Box p={4}>
              <Stack spacing={2} align={"center"} mb={5}>
                <Heading fontSize={"2xl"} fontWeight={500} fontFamily={"body"}>
                  {currentUserData.displayName}
                </Heading>
                <Text color={"gray.500"}>{currentUserData.email}</Text>
              </Stack>

              <Stack direction={"row"} justify={"center"} spacing={6}>
                <Stack spacing={0} align={"center"}>
                  <Text fontWeight={600}>
                    {currentUserData.followers &&
                      currentUserData.followers.length}
                  </Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Followers
                  </Text>
                </Stack>
                <Stack spacing={0} align={"center"}>
                  <Text fontWeight={600}>
                    {currentUserData.following &&
                      currentUserData.following.length}
                  </Text>
                  <Text fontSize={"sm"} color={"gray.500"}>
                    Following
                  </Text>
                </Stack>
              </Stack>
            </Box>
            <Box className="flex items-center justify-center mt-3">
              <Link href="/profile/profile_edit">
                <Button colorScheme="blue">Edit profile</Button>
              </Link>
            </Box>
          </Box>
        </Center>
      )}
    </>
  );
}
