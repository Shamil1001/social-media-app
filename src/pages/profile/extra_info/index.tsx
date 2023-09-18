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
// import TextArea from "antd/es/input/TextArea";

import { useState } from "react";
import { auth, db } from "../../../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";

export default function ExtraInfo() {
  const [extraData, setExtraData] = useState<any>({
    first_name: null,
    last_name: null,
    birthday: null,
    age: null,
    gender: null,
    bio: null,
  });
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setExtraData({ ...extraData, birthday: dateString });
  };
  const currentUser = auth.currentUser;
  const router = useRouter();
  const handleSaveExtraInfo = async () => {
    await updateDoc(doc(db, "users", `${currentUser?.uid}`), {
      ...extraData,
    });
    router.push("/profile");
    setExtraData({
      ...extraData,
      first_name: null,
      last_name: null,
      birthday: null,
      age: null,
      gender: null,
      bio: null,
    });
  };
  //
  return (
    <>
      <Center className="p-5">
        <Card h={"100vh"} w={"50%"}>
          <CardHeader>About me</CardHeader>
          <Divider />
          <Grid className="m-5" templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem colSpan={1}>
              <Box>
                <Text>First name</Text>
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
                <Text>Last name</Text>
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
                <Text>Birthday</Text>
                <DatePicker
                  style={{ width: "40%" }}
                  className="absolute"
                  onChange={onChange}
                />
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box>
                <Text>Age</Text>
                <InputNumber
                  onChange={(e) => setExtraData({ ...extraData, age: e })}
                  style={{ width: "100%" }}
                />
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box>
                <Text>Gender</Text>
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
              <Text>Bio</Text>
              {/* <TextArea
                value={extraData.bio}
                onChange={(e) =>
                  setExtraData({ ...extraData, bio: e.target.value })
                }
                className="flex max-h-[100px]"
                rows={4}
                placeholder="About me ..."
                maxLength={200}
              /> */}
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
