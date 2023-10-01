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
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { auth, db, storage } from "../../../../firebase";
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
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import ExtraInfoModal from "@/features/extra_info_modal";
import { useRouter } from "next/router";

export default function ProfileEdit() {
  const {
    isOpen: isInfoModalOpen,
    onOpen: onInfoModalOpen,
    onClose: onInfoModalClose,
  } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentUserData, setCurrentUserData] = useState<any>();
  const [userDocId, setUserDocId] = useState();
  const [postDocIds, setPostDocIds] = useState([]);

  const router = useRouter();

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

      if (!user) {
        console.error("User is not authenticated");
        return;
      }
      const uid = uuidv4();

      if (selectedImage) {
        // Upload the selected image to Firebase Storage
        const storageRef = ref(storage, `images/${uid}/${selectedImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        // console.log("uploadTask", uploadTask.snapshot.ref);
        getDownloadURL(uploadTask.snapshot.ref).then((snapshot) => {
          const profileUpdates = {
            displayName: currentUserData.displayName || null,
            email: currentUserData.email || null,
            photoURL: snapshot,
            // Add other properties like photoURL if needed
          };
          const profileUpdate = async () => {
            await updateProfile(user, profileUpdates);

            await updateDoc(doc(db, "users", `${userDocId}`), {
              displayName: currentUserData.displayName,
              email: currentUserData.email,
              photoURL: snapshot, // Set the new photoURL here as well
            });
          };
          profileUpdate();
        });
        // const photoURL = snapshot;
        // console.log("snapshot", snapshot);

        // Update the user's profile with the new photoURL

        console.log("Profile photo updated successfully!");
      } else {
        const profileUpdates = {
          displayName: currentUserData.displayName || null,
          email: currentUserData.email || null,
          // Add other properties like photoURL if needed
        };

        // If no image is selected, only update the display name and email
        await updateProfile(user, profileUpdates);

        // Update the display name and email in Firestore
        await updateDoc(doc(db, "users", `${userDocId}`), {
          displayName: currentUserData.displayName,
          email: currentUserData.email,
        });

        console.log("Profile updated successfully!");
      }

      // const profileUpdates = {
      //   displayName: currentUserData.displayName || null,
      //   email: currentUserData.email || null,
      //   // Add other properties like photoURL if needed
      // };

      // await updateProfile(user, profileUpdates);

      // await updateDoc(doc(db, "users", `${userDocId}`), {
      //   displayName: currentUserData.displayName,
      //   email: currentUserData.email,
      // });
      // // }

      // console.log("Profile updated successfully!", user);
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

  // console.log("currentUserData", currentUserData.photoUrl);

  return (
    <>
      <Navbar />
      <div className="flex justify-center mt-5 h-[85vh]">
        <Card boxShadow={"2xl"} width={"xl"} minW={"md"} height={"md"}>
          <CardBody className="flex flex-col items-center">
            <Avatar size={"xl"} src={currentUserData?.photoURL} />
            <Box mt={5}>
              <Box className="flex justify-center">
                <label htmlFor="file2" className="flex flex-row gap-6">
                  <span className="p-2 bg-blue-400 rounded cursor-pointer">
                    Select image
                  </span>
                </label>
                <input
                  multiple
                  type="file"
                  id="file2"
                  hidden
                  onChange={(e: any) => setSelectedImage(e.target.files[0])}
                />
              </Box>
              <Stack className="mt-4">
                <Text className="text-sm font-semibold">UserName</Text>
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
                <Text className="text-sm font-semibold">Email</Text>
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
                <Box>
                  <Text
                    onClick={() => router.push("/profile/extra_info")}
                    className="cursor-pointer w-[50%] font-semibold text-blue-500 hover:text-blue-900"
                  >
                    Add extra info
                  </Text>
                </Box>
                {/* <ExtraInfoModal
                  isOpen={isInfoModalOpen}
                  onClose={onInfoModalClose}
                /> */}
              </Stack>
            </Box>
          </CardBody>
          <CardFooter className="flex items-center justify-center w-full mt-[-20px] ">
            <Button className="w-[50%]" colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
