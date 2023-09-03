import Chatbox from "@/components/chatbox";
import Navbar from "@/components/navbar/navbar";
import Sidebar from "@/components/sidebar";
import { Box } from "@chakra-ui/react";
//ss
export default function Chat() {
  return (
    <>
      <Navbar />
      <Box className="flex flex-row">
        <Sidebar />
        <Chatbox />
      </Box>
    </>
  );
}
