"use client";
import {
  Box,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";

import { Select, DatePicker, DatePickerProps, Input, InputNumber } from "antd";
import { Textarea } from "@chakra-ui/react";
// import TextArea from "antd/es/input/TextArea";

import { useEffect, useState } from "react";
import { auth, db } from "../../../../firebase";
import { updateDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar/navbar";

export default function ExtraInfo() {
  const [currentUserData, setCurrentUserData] = useState<any>();

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const filteredUser = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == auth.currentUser?.uid;
        });
        // console.log("current", filteredUser[0].data());
        const fetchedUser = filteredUser[0].data();
        setCurrentUserData(fetchedUser);
        setExtraData({
          ...fetchedUser,
          first_name:
            fetchedUser && fetchedUser.first_name
              ? fetchedUser.first_name
              : null,
          last_name:
            fetchedUser && fetchedUser.last_name ? fetchedUser.last_name : null,
          birthday:
            fetchedUser && fetchedUser.birthday ? fetchedUser.birthday : null,
          age: fetchedUser && fetchedUser.age ? fetchedUser.age : null,
          gender: fetchedUser && fetchedUser.gender ? fetchedUser.gender : null,
          bio: fetchedUser && fetchedUser.bio ? fetchedUser.bio : null,
        });
      }),
    []
  );
  // first_name: currentUserData.first_name ? currentUserData.first_name : null,
  // last_name: currentUserData.last_name ? currentUserData.last_name : null,
  const [extraData, setExtraData] = useState<any>({
    first_name: null,
    last_name: null,
    birthday: null,
    age: null,
    gender: null,
    bio: null,
  });

  const calculateAge = (dateString: string) => {
    const birthdayDate = new Date(dateString);
    const currentDate = new Date();

    let ageYears = currentDate.getFullYear() - birthdayDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const birthMonth = birthdayDate.getMonth();

    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth &&
        currentDate.getDate() < birthdayDate.getDate())
    ) {
      ageYears--;
    }
    setExtraData({ ...extraData, age: ageYears });
  };

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    calculateAge(dateString);
    setExtraData({ ...extraData, birthday: dateString });
  };
  const currentUser = auth.currentUser;
  const router = useRouter();
  const handleSaveExtraInfo = async () => {
    await updateDoc(doc(db, "users", `${currentUser?.uid}`), {
      ...extraData,
    });
    router.push("/profile");
    // setExtraData({
    //   ...extraData,
    //   first_name: null,
    //   last_name: null,
    //   birthday: null,
    //   age: null,
    //   gender: null,
    //   bio: null,
    // });
  };
  // console.log("extra", currentUserData.first_name);
  return (
    <>
      <Navbar />
      <Center className="p-5">
        <Card
          boxShadow={"2xl"}
          marginTop={"20px"}
          h={{ base: "60vh", md: "85vh" }}
          w={{ base: "70%", md: "50%" }}
        >
          <CardHeader className="font-semibold">About me</CardHeader>
          <Divider />
          <Grid className="m-5" templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem colSpan={1}>
              <Box>
                <Text className="font-semibold">First name</Text>
                <Input
                  value={extraData.first_name}
                  onChange={(e) =>
                    setExtraData({ ...extraData, first_name: e.target.value })
                  }
                  style={{ width: "100%" }}
                  placeholder="Shamil"
                />
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box>
                <Text className="font-semibold">Last name</Text>
                <Input
                  value={extraData.last_name}
                  onChange={(e) =>
                    setExtraData({ ...extraData, last_name: e.target.value })
                  }
                  style={{ width: "100%" }}
                  placeholder="Jemhurov"
                />
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box className="w-full">
                <Text className="font-semibold">Birthday</Text>
                <DatePicker
                  style={{ width: "40%" }}
                  className="absolute"
                  onChange={onChange}
                />
              </Box>
            </GridItem>
            {/* <GridItem colSpan={1}>
              <Box>
                <Text>Age</Text>
                <InputNumber
                  onChange={(e) => setExtraData({ ...extraData, age: e })}
                  style={{ width: "100%" }}
                />
              </Box>
            </GridItem> */}
            <GridItem colSpan={1}>
              <Box>
                <Text className="font-semibold">Gender</Text>
                <Select
                  value={extraData.gender}
                  style={{ width: "100%" }}
                  onChange={(e) => setExtraData({ ...extraData, gender: e })}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]}
                />
              </Box>
            </GridItem>
            <GridItem colSpan={2}>
              <Text className="font-semibold">Bio</Text>
              <Textarea
                placeholder="About me ..."
                value={extraData.bio}
                onChange={(e) =>
                  setExtraData({ ...extraData, bio: e.target.value })
                }
                maxLength={100}
                className="flex max-h-[100px]"
              />
            </GridItem>
          </Grid>
          <CardFooter className="flex justify-center">
            <Button
              className="w-[40%]"
              colorScheme="blue"
              onClick={handleSaveExtraInfo}
            >
              Submit
            </Button>
          </CardFooter>
        </Card>
      </Center>
    </>
  );
}
