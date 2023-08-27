import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Link,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  HStack,
  Input,
  MenuGroup,
  Divider,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { signOut } from "next-auth/react";

import { IoMdNotificationsOutline } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { useSession } from "next-auth/react";
import { auth, db } from "../../../firebase";
import SearchUsers from "@/features/search_users/search_users";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
// import { Link } from "@chakra-ui/react";

const Links = [
  { title: "Home", icon: <AiFillHome />, link: "/home_page/Home" },
  {
    title: "Notification",
    icon: <IoMdNotificationsOutline />,
    link: "#",
  },
  { title: "Person", icon: <BsPerson />, link: "/home_page/Home" },
];

const NavLink = ({ children }: { children: any }) => (
  // console.log(children)
  <Link
    px={2}
    py={1}
    fontSize={25}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      // bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={children.link}
  >
    {children.icon}
  </Link>
);

interface RequestedUser {
  displayName: string;
  photoUrl: string;
}

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();

  const { data: session } = useSession();
  const [docId, setDocId] = useState("");
  const [currentUser, setCurrentUser] = useState<any>({ friendRequests: [] });
  const [requestedUser, setRequestedUser] = useState<RequestedUser[]>();
  const [requestedDocIds, setRequestedDocIds] = useState<string[]>();

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const user = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == auth.currentUser?.uid;
        });
        setCurrentUser(user[0].data());
        const filteredId = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == auth.currentUser?.uid;
        });
        setDocId(filteredId[0].id);
        const requestedUsers = snapshot.docs
          .filter((doc: any) => {
            return user[0].data().friendRequests.includes(doc.data().uid);
          })
          .map((item: any) => item.data());
        const reqDocIds = snapshot.docs
          .filter((doc: any) => {
            return user[0].data().friendRequests.includes(doc.data().uid);
          })
          .map((item: any) => item.id);
        setRequestedDocIds(reqDocIds);
        if (requestedUsers.length !== 0) {
          setRequestedUser(requestedUsers);
        }
      }),

    []
  );
  const handleAcceptFriendRequest = async (
    reqestedId: string,
    reqestedDoc: string,
    reqUserfollowing: string[]
  ) => {
    const followers = [...currentUser?.followers, reqestedId];
    const requestedIds = currentUser.friendRequests.filter(
      (id: string) => id !== reqestedId
    );
    // console.log(reqestedDoc);

    await updateDoc(doc(db, "users", `${docId}`), {
      followers: followers,
      friendRequests: requestedIds,
    });
    const following = [...reqUserfollowing, currentUser.uid];

    await updateDoc(doc(db, "users", `${reqestedDoc}`), {
      following: following,
    });

    // console.log(docId);
  };

  const handleLogOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          {/* <Box>Social media app</Box> */}
          <SearchUsers />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={6}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <div key={link.title}>
                  {link.title == "Notification" ? (
                    <Menu>
                      <MenuButton>
                        <IoMdNotificationsOutline fontSize={25} />
                      </MenuButton>
                      {currentUser &&
                        currentUser.friendRequests.length !== 0 &&
                        requestedUser &&
                        requestedDocIds &&
                        requestedDocIds?.length !== 0 && (
                          // requestedUser.map((item: any, index: number) => (
                          <MenuList>
                            <MenuGroup>
                              <MenuItem>Friend requests</MenuItem>
                              <Divider />
                              {/* <MenuGroupTitle>Header</MenuGroupTitle> */}
                              {requestedUser.map((item: any, index: number) => (
                                <MenuItem
                                  className="flex flex-row gap-5"
                                  key={index}
                                >
                                  <Avatar src={item.photoUrl} />
                                  <p>{item.displayName}</p>
                                  <Button
                                    color="green.500"
                                    onClick={() =>
                                      handleAcceptFriendRequest(
                                        item?.uid,
                                        requestedDocIds[index],
                                        item.following
                                      )
                                    }
                                  >
                                    Accept
                                  </Button>
                                </MenuItem>
                              ))}
                            </MenuGroup>
                          </MenuList>
                        )}
                    </Menu>
                  ) : (
                    <NavLink key={link.title}>{link}</NavLink>
                  )}
                </div>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"sm"} src={`${auth.currentUser?.photoURL}`} />
                  <p>{auth.currentUser?.displayName}</p>
                </MenuButton>
                <MenuList alignItems={"center"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={`${auth.currentUser?.photoURL}`}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{session?.user?.name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <Link href="/profile">
                    <MenuItem>My Profile</MenuItem>
                  </Link>
                  <Link href="/profile/profile_edit">
                    <MenuItem>Edit Profile</MenuItem>
                  </Link>
                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
