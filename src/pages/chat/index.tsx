import Chatbox from "@/components/chatbox";
import Navbar from "@/components/navbar/navbar";
// import Sidebar from "../../components/sidebar/index";
import Sidebar from "../../components/sidebar/sidebar";
import { Box } from "@chakra-ui/react";

export default function Chat() {
  return (
    <>
      {/* <Navbar /> */}
      <Box className="flex flex-row">
        <Sidebar />
        <Chatbox />
      </Box>
    </>
  );
}
