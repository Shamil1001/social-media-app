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
} from "@chakra-ui/react";
import { onSnapshot, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import Link from "next/link";

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className="flex justify-center mt-5">
        <Card width={"xl"} minW={"md"} height={"md"}>
          {/* <CardHeader>My Account</CardHeader> */}
          {/* <Divider /> */}
          <CardBody className="flex flex-col items-center">
            <Avatar size={"xl"} src={`${auth.currentUser?.photoURL}`} />
            <Box mt={5}>
              <Stack>
                <Text className="text-lg font-bold text-gray-400">
                  About me
                </Text>
              </Stack>
              <Stack>
                <Text className="font-bold text-gray-400 text-md">
                  {auth.currentUser?.displayName}
                </Text>
              </Stack>
            </Box>
          </CardBody>
          <CardFooter>
            <Link
              className="flex items-center justify-center w-full"
              href="/profile/profile_edit"
            >
              <Button className="w-[50%]">Edit profile</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
