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
  Grid,
  GridItem,
  IconButton,
  Drawer,
  DrawerContent,
  CloseButton,
  BoxProps,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { CloseIcon, HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { signOut } from "next-auth/react";

import { IoMdNotificationsOutline } from "react-icons/io";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import {
  BsPerson,
  BsPersonFill,
  BsChatText,
  BsFillChatTextFill,
  BsChatTextFill,
} from "react-icons/bs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { auth, db } from "../../../firebase";
import SearchUsers from "@/features/search_users/search_users";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { FiMenu } from "react-icons/fi";
// import { Link } from "@chakra-ui/react";

interface RequestedUser {
  displayName: string;
  photoUrl: string;
}

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const path = router.pathname;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: session } = useSession();
  const [docId, setDocId] = useState("");
  const [currentUser, setCurrentUser] = useState<any>({ friendRequests: [] });
  const [requestedUser, setRequestedUser] = useState<RequestedUser[]>();
  const [requestedDocIds, setRequestedDocIds] = useState<string[]>();

  const Links = [
    {
      title: "Home",
      icon: path.includes("home") ? <AiFillHome /> : <AiOutlineHome />,
      link: "/home_page/Home",
    },
    {
      title: "Person",
      icon: path.includes("friends") ? <BsPersonFill /> : <BsPerson />,
      link: "/friends",
    },
    {
      title: "Person",
      icon: path.includes("chat") ? <BsChatTextFill /> : <BsChatText />,
      link: "/chat",
    },
  ];

  const NavLink = ({ children }: { children: any }) => (
    <span
      className="text-[25px] px-2 py-1 rounded-md cursor-pointer"
      onClick={() => router.push(`${children.link}`)}
    >
      {children.icon}
    </span>
  );

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
    const followwing = [...currentUser?.following, reqestedId];
    const requestedIds = currentUser.friendRequests.filter(
      (id: string) => id !== reqestedId
    );
    // console.log(reqestedDoc);
    const combinedUid =
      currentUser?.uid > reqestedId
        ? currentUser?.uid + reqestedId
        : reqestedId + currentUser?.uid;

    await setDoc(doc(db, "chats", combinedUid), { messages: [] });

    await updateDoc(doc(db, "users", `${docId}`), {
      followers: followers,
      friendRequests: requestedIds,
      following: followwing,
    });
    const following = [...reqUserfollowing, currentUser.uid];
    // const followwers = [...reqUserfollowing, currentUser.uid];

    await updateDoc(doc(db, "users", `${reqestedDoc}`), {
      following: following,
      // followers: followwers,
    });

    // console.log(docId);
  };

  const handleLogOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        bg={useColorModeValue("gray.100", "gray.900")}
        px={4}
        width={"100%"}
        height={isOpen ? "15%" : "100px"}
        minH={"14%"}
      >
        <Grid
          width={{ base: "95%", md: "100%" }}
          templateColumns={{ base: "repeat(2, 30%)", md: "repeat(3, 30%)" }}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          {/* <IconButton
            size={"md"}
            width={"12"}
            icon={
              isOpen ? (
                <CloseIcon fontSize={"xl"} />
              ) : (
                <HamburgerIcon fontSize={"2xl"} />
              )
            }
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          /> */}
          <IconButton
            size={"md"}
            width={"12"}
            pl={"15px"}
            variant="outline"
            onClick={onOpen}
            display={{ md: "none" }}
            aria-label="open menu"
            icon={<FiMenu />}
          />
          <GridItem
            alignItems={"center"}
            display={{ base: "none", md: "flex" }}
          >
            <SearchUsers />
          </GridItem>

          <GridItem
            display={{ base: "none", md: "flex" }}
            justifyContent={"center"}
          >
            <Box
              height={"100%"}
              as={"nav"}
              alignItems={"center"}
              className="flex flex-row justify-center gap-8"
            >
              {Links.map((link) => (
                <Box key={link.title}>
                  <NavLink key={link.title}>{link}</NavLink>
                </Box>
              ))}
            </Box>
          </GridItem>
          <GridItem>
            <Stack
              className="relative"
              justifyContent={"end"}
              direction={"row"}
              spacing={5}
            >
              <Menu>
                <MenuButton>
                  <IoMdNotificationsOutline className="text-[28px]" />
                  {currentUser.friendRequests.length !== 0 && (
                    <Text className="absolute w-5 h-5 text-[12px] font-bold text-white-500 rounded-[100%] text-center top-1 ml-4 bg-slate-700 text-white">
                      {currentUser.friendRequests.length}
                    </Text>
                  )}
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
                          <MenuItem className="flex flex-row gap-5" key={index}>
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
              <Button className="" onClick={toggleColorMode}>
                {colorMode === "light" ? (
                  <MoonIcon className="text-[23px]" />
                ) : (
                  <SunIcon className="text-[23px]" />
                )}
              </Button>

              <Menu>
                <MenuButton
                  onClick={() => console.log("clicked")}
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}

                  // minW={0}
                >
                  <Avatar size={"sm"} src={`${auth.currentUser?.photoURL}`} />
                  {/* <p>{auth.currentUser?.displayName}</p> */}
                </MenuButton>
                <MenuList alignItems={"center"} marginLeft={"-20"}>
                  <br />
                  <Center>
                    <Avatar
                      size={"2xl"}
                      src={`${auth.currentUser?.photoURL}`}
                    />
                  </Center>
                  <br />
                  <Center>
                    <Text className="text-xl font-bold">
                      {auth.currentUser?.displayName}
                    </Text>
                  </Center>
                  <br />
                  <MenuDivider />

                  <MenuItem onClick={() => router.push("/profile")}>
                    My Profile
                  </MenuItem>

                  <MenuItem
                    onClick={() => router.push("/profile/profile_edit")}
                  >
                    Edit Profile
                  </MenuItem>

                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </GridItem>
        </Grid>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <SidebarContent onClose={onClose} />
          </DrawerContent>
        </Drawer>
      </Box>
    </>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const router = useRouter();
  const path = router.pathname;
  const Links = [
    {
      title: "Home",
      icon: path.includes("home") ? <AiFillHome /> : <AiOutlineHome />,
      link: "/home_page/Home",
    },
    {
      title: "Friends",
      icon: path.includes("friends") ? <BsPersonFill /> : <BsPerson />,
      link: "/friends",
    },
    {
      title: "Chat",
      icon: path.includes("chat") ? <BsChatTextFill /> : <BsChatText />,
      link: "/chat",
    },
  ];

  const NavLink = ({ children }: { children: any }) => (
    <span
      className="text-[25px] px-2 py-1 rounded-md cursor-pointer"
      onClick={() => router.push(`${children.link}`)}
    >
      {children.icon}
    </span>
  );

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        {/* <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold"></Text> */}
        <SearchUsers />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      <Flex direction={"column"} gap={"20px"} mx="8">
        {Links.map((link) => (
          <Flex key={link.title} gap={"10px"} alignItems="center">
            <NavLink>{link}</NavLink>
            <label>{link.title}</label>
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
