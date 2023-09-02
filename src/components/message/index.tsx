import { Avatar, Box } from "@chakra-ui/react";

export default function Message() {
  return (
    <>
      <Box className="flex flex-row gap-3">
        <Avatar name="Shamil Jemhurov" size={"sm"} />
        <Box>MEssage</Box>
      </Box>
    </>
  );
}
