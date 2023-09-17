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
import TextArea from "antd/es/input/TextArea";

export default function ExtraInfo() {
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

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
                <Input style={{ width: "100%" }} placeholder="Shamil" />
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box>
                <Text>Last name</Text>
                <Input style={{ width: "100%" }} placeholder="Jemhurov" />
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
                <InputNumber defaultValue={20} style={{ width: "100%" }} />
              </Box>
            </GridItem>
            <GridItem colSpan={1}>
              <Box>
                <Text>Gender</Text>
                <Select
                  defaultValue="male"
                  style={{ width: "100%" }}
                  //   onChange={handleChange}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
              </Box>
            </GridItem>
            <GridItem colSpan={2}>
              <Text>Bio</Text>
              <TextArea
                className="flex max-h-[100px]"
                rows={4}
                placeholder="About me ..."
                maxLength={200}
              />
            </GridItem>
          </Grid>
          <CardFooter className="flex justify-center">
            <Button className="w-[40%]" colorScheme="blue">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </Center>
    </>
  );
}
