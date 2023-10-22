"use client";

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
      {/* <div className="flex justify-center mt-5"> */}
      <Navbar />
      {currentUserData && (
        <Center className="h-full">
          <Box
            maxW={"100%"}
            marginTop={"5"}
            marginBottom={"5"}
            w={{ base: "70vw", md: "50%" }}
            h={{ base: "50vh", xs: "70vh", md: "80vh" }}
            // eslint-disable-next-line react-hooks/rules-of-hooks
            bg={useColorModeValue("white", "gray.800")}
            boxShadow={"2xl"}
            rounded={"md"}
            overflow={"hidden"}
          >
            <Flex justify={"center"} mt={6}>
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
                {currentUserData.first_name && currentUserData.last_name && (
                  <Text color={"gray.500"}>
                    Full name:{" "}
                    {currentUserData.first_name +
                      " " +
                      currentUserData.last_name}
                  </Text>
                )}
                {currentUserData.birthday && (
                  <Text color={"gray.500"}>
                    Birthday: {currentUserData.birthday}
                  </Text>
                )}
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
            <Box className="flex items-center justify-center my-5">
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
