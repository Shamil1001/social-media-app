import {
  Card,
  Avatar,
  Button,
  CardBody,
  Box,
  Stack,
  CardFooter,
  Text,
  Input,
} from "@chakra-ui/react";
import Link from "next/link";
import { auth, db } from "../../../../firebase";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import Navbar from "@/components/navbar/navbar";
import {
  onSnapshot,
  collection,
  doc,
  documentId,
  updateDoc,
} from "firebase/firestore";

export default function ProfileEdit() {
  // const [editValues, setEditValues] = useState({
  //   username: auth.currentUser?.displayName || "",
  //   email: auth.currentUser?.email || "",
  // });
  const [currentUserData, setCurrentUserData] = useState<any>();
  const [userDocId, setUserDocId] = useState();
  const [postDocIds, setPostDocIds] = useState([]);

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const filteredUser = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == auth.currentUser?.uid;
        });
        setUserDocId(filteredUser[0].id);
        setCurrentUserData(filteredUser[0].data());
      }),
    []
  );
  useEffect(
    () =>
      onSnapshot(collection(db, "posts"), (snapshot: any) => {
        const filteredPosts = snapshot.docs
          .filter((doc: any) => {
            return doc.data().userId == auth.currentUser?.uid;
          })
          .map((post: any) => post.id);
        setPostDocIds(filteredPosts);
        console.log("postIDs", filteredPosts);
      }),
    []
  );

  const handleSave = async () => {
    try {
      const user = auth.currentUser;

      // Update display name

      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      const profileUpdates = {
        displayName: currentUserData.displayName || null,
        email: currentUserData.email || null,
        // Add other properties like photoURL if needed
      };

      await updateProfile(user, profileUpdates);

      await updateDoc(doc(db, "users", `${userDocId}`), {
        displayName: currentUserData.displayName,
        email: currentUserData.email,
      });

      // postDocIds.map((postId: string) => {
      //   return postUserChange(postId);
      // });

      console.log("Profile updated successfully!", user);
      //   console.log(user)
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
    }
  };

  const postUserChange = async (postId: any) => {
    await updateDoc(doc(db, "posts", `${postId}`), {
      displayName: currentUserData.displayName,
      email: currentUserData.email,
    });
  };

  return (
    <>
      {/* <Navbar /> */}
      <Navbar />
      <div className="flex justify-center mt-5">
        <Card width={"xl"} minW={"md"} height={"md"}>
          <CardBody className="flex flex-col items-center">
            <Avatar size={"xl"} src={currentUserData?.photoURL} />
            <Box mt={5}>
              <Stack>
                {/* <Text className="text-lg font-bold text-white">About me</Text> */}
              </Stack>
              <Stack>
                <Text className="text-sm text-white">UserName</Text>
                <Input
                  value={currentUserData?.displayName}
                  placeholder="Username"
                  onChange={(e) =>
                    setCurrentUserData({
                      ...currentUserData,
                      displayName: e.target.value,
                    })
                  }
                />
                <Text className="text-sm text-white">Email</Text>
                <Input
                  value={currentUserData?.email}
                  placeholder="Email"
                  onChange={(e) =>
                    setCurrentUserData({
                      ...currentUserData,
                      email: e.target.value,
                    })
                  }
                />
              </Stack>
            </Box>
          </CardBody>
          <CardFooter className="flex items-center justify-center w-full">
            <Button className="w-[50%]" colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
