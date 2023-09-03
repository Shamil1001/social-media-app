import { Avatar, Box } from "@chakra-ui/react";

export default function Message({ message }: any) {
  return (
    <>
      <Box className="flex flex-row gap-3">
        <Avatar name="Shamil Jemhurov" size={"sm"} />
        <Box>{message.text}</Box>
      </Box>
    </>
  );
}
