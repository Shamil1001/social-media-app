import Chatbox from "@/components/chatbox";
import Navbar from "@/components/navbar/navbar";
// import Sidebar from "../../components/sidebar/index";
import Sidebar from "../../components/sidebar/sidebar";
import { Box } from "@chakra-ui/react";
import { useState } from "react";

export default function Chat() {
  const [sidebarDisplay, setSidebarDisplay] = useState(true);
  return (
    <>
      <Navbar />
      <Box className="flex flex-row">
        {sidebarDisplay && <Sidebar setSidebarDisplay={setSidebarDisplay} />}
        {!sidebarDisplay && <Chatbox setSidebarDisplay={setSidebarDisplay} />}
        {/* <Sidebar setSidebarDisplay={setSidebarDisplay} />
        <Chatbox setSidebarDisplay={setSidebarDisplay} /> */}
      </Box>
    </>
  );
}
