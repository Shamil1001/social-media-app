import {
  Card,
  CardBody,
  CardHeader,
  Text,
  Avatar,
  Box,
} from "@chakra-ui/react";

export default function Siderbar() {
  return (
    <>
      <Card w="20%" h="80vh">
        {/* <CardHeader>
          <Text>Header</Text>
        </CardHeader> */}
        <CardBody display="flex" flexDirection="column" gap={5}>
          <Box className="flex flex-row items-center gap-2 p-2 rounded cursor-pointer bg-slate-700">
            <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
            <Text>Dan Abramov</Text>
          </Box>
          <Box className="flex flex-row items-center gap-2 p-2 rounded cursor-pointer bg-slate-700">
            <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
            <Text>Dan Abramov</Text>
          </Box>
        </CardBody>
      </Card>
    </>
  );
}
