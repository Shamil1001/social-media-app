import { Box, Card } from "@chakra-ui/react";

import { auth } from "../../../firebase";
import { Avatar } from "@chakra-ui/react";

export default function Sidebar() {
  const currentUser = auth.currentUser;
  return (
    <>
      <Card
        w={"20%"}
        h={"88vh"}
        p={3}
        className="flex flex-col gap-6"
        rounded={"0px"}
      >
        <Box className="flex flex-row items-center gap-2 p-2 rounded cursor-pointer hover:bg-slate-700">
          <Avatar
            name="Shamil Jemhurov"
            size={"sm"}
            src={`${currentUser?.photoURL}`}
          />
          <Box>{currentUser?.displayName}</Box>
        </Box>
        <Box className="flex flex-row items-center gap-2 p-2 rounded cursor-pointer hover:bg-slate-700">
          <Avatar
            name="Shamil Jemhurov"
            size={"sm"}
            src={`${currentUser?.photoURL}`}
          />
          <Box>{currentUser?.displayName}</Box>
        </Box>
        <Box className="flex flex-row items-center gap-2 p-2 rounded cursor-pointer hover:bg-slate-700">
          <Avatar
            name="Shamil Jemhurov"
            size={"sm"}
            src={`${currentUser?.photoURL}`}
          />
          <Box>{currentUser?.displayName}</Box>
        </Box>
      </Card>
    </>
  );
}
