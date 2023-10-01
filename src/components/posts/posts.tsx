import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ModalOverlay,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  FormLabel,
  FormControl,
  Input,
  useColorMode,
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLike, BiDislike, BiChat } from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { auth, db } from "../../../firebase";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Moment from "react-moment";
import { useContext, useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import EditPost from "@/features/edit_post";
import CommentModal from "@/features/delete_modal";

interface PostProps {
  post: any;
  userData: any;
}

export default function Post({ post, userData }: PostProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCommentOpen,
    onOpen: onCommentOpen,
    onClose: onCommentClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [selectedPostId, setSelectedPostId] = useState("");
  const [currentUserData, setCurrentUserData] = useState<any>();
  const [docId, setDocId] = useState("");

  const { colorMode, toggleColorMode } = useColorMode();

  const OverlayTwo = () => (
    <ModalOverlay bg="none" backdropFilter="auto" backdropBlur="2px" />
  );

  const [overlay, setOverlay] = useState(<OverlayTwo />);

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const currentUser = auth.currentUser;

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const filteredId = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == auth.currentUser?.uid;
        });
        setCurrentUserData(filteredId[0].data());
        setDocId(filteredId[0].id);
      }),

    []
  );

  // console.log("userData ", userData);
  const handleDeletePost = async (postId: string) => {
    const filteredUser = userData.find((user: any) =>
      user.posts.includes(postId)
    );
    const updatedPosts = filteredUser.posts.filter((post: any) => {
      return post !== postId;
    });
    console.log("filteredUser", docId);
    await updateDoc(doc(db, "users", `${docId}`), {
      posts: updatedPosts,
    });
    await deleteDoc(doc(db, "posts", `${post.postId}`));

    onClose();
  };

  const handleEditPost = async (editValue: string) => {
    console.log("IDSss", docId, selectedPostId);
    await updateDoc(doc(db, "posts", `${post.postId}`), {
      text: editValue,
    });

    onEditClose();
  };

  const handleOpenModal = (postId: string) => {
    setSelectedPostId(postId);
    onOpen();
  };

  const handleOpenEditModal = (postId: string) => {
    setSelectedPostId(postId);
    console.log(post.postId);
    onEditOpen();
  };

  useEffect(
    () =>
      onSnapshot(
        collection(db, "posts", `${post.postId}`, "likes"),
        (snapshot: any) => setLikes(snapshot.docs)
      ),

    [post.postId]
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "posts", `${post.postId}`, "comments"),
        (snapshot: any) => {
          const fetchComments = snapshot.docs.map((doc: any) => doc.data());
          setComments(fetchComments);
        }
      ),

    [post.postId]
  );

  useEffect(
    () =>
      setLiked(
        likes.findIndex((like: any) => like.id === currentUser?.uid) !== -1
      ),
    [likes]
  );

  const likePost = async () => {
    if (liked && currentUser !== null) {
      await deleteDoc(
        doc(db, "posts", `${post.postId}`, "likes", currentUser.uid)
      );
    }
    if (!liked && currentUser !== null) {
      await setDoc(
        doc(db, "posts", `${post.postId}`, "likes", currentUser.uid),
        {
          username: currentUser.displayName,
          comment: commentValue,
        }
      );
    }
  };

  const handleComment = async () => {
    const uuid = uuidv4();
    if (currentUser !== null && commentValue.length !== 0) {
      await setDoc(doc(db, "posts", `${post.postId}`, "comments", uuid), {
        userdata: currentUser.displayName,
        userId: currentUser.uid,
        email: currentUser.email,
        photoUrl: currentUser.photoURL,
        comment: commentValue,
        timestampL: serverTimestamp(),
      });
      setCommentValue("");
      console.log("commented");
    }
  };

  const handlePress = (e: any) => {
    if (e.key == "Enter") {
      handleComment();
    }
  };

  return (
    <>
      {currentUserData &&
        (currentUserData.following.includes(post.userId) ||
          currentUserData.uid === post.userId) && (
          <Card maxW="md" boxShadow="2xl">
            <CardHeader>
              <Flex>
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Avatar name={post.displayName} src={post.userImg} />

                  <Box>
                    {/* {post.displayName} */}
                    <Heading size="md">{post.displayName}</Heading>
                    {/* <p>@{post.displayName.toLowerCase()}</p> */}
                    <Moment className="text-sm text-gray-400" fromNow>
                      {post?.timestampL?.toDate()}
                    </Moment>
                  </Box>
                  {/* <Divider /> */}
                </Flex>
                {post.userId === auth.currentUser?.uid && (
                  <>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<BsThreeDotsVertical />}
                      ></MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => handleOpenModal(post.postId)}>
                          Delete post
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleOpenEditModal(post.postId)}
                        >
                          Edit post
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    {/* <p>{postData.text}</p> */}

                    <EditPost
                      key={post.postId + "a"}
                      isEditOpen={isEditOpen}
                      onEditClose={onEditClose}
                      textValue={post.text}
                      selectedPostId={selectedPostId}
                      handleEditPost={handleEditPost}
                    />
                    <CommentModal
                      key={post.postId}
                      isOpen={isOpen}
                      onClose={onClose}
                      selectedPostId={selectedPostId}
                      handleDeletePost={handleDeletePost}
                    />
                  </>
                )}
              </Flex>
            </CardHeader>
            <CardBody w={"md"}>
              <p>{post.text}</p>
            </CardBody>
            {post.image && <img src={post.image} />}
            <Divider />
            <CardFooter
              justify="space-between"
              flexWrap="wrap"
              sx={{
                "& > button": {
                  minW: "136px",
                },
              }}
            >
              <Button
                flex="1"
                onClick={(e) => {
                  e.stopPropagation();
                  likePost();
                }}
                variant="ghost"
                leftIcon={
                  liked ? (
                    <AiFillHeart
                      className={
                        colorMode == "dark"
                          ? "hoverEffect w-7 h-7 p-1 text-red-600"
                          : "hoverEffect w-7 h-7 p-1 text-red-600"
                      }
                    />
                  ) : (
                    <AiOutlineHeart className="p-1 hoverEffect w-7 h-7 " />
                  )
                }
              >
                {likes.length > 0 && (
                  <span
                    className={
                      colorMode == "dark"
                        ? `${liked && "text-white"} text-sm`
                        : `${liked && "text-black"} text-sm`
                    }
                  >
                    {likes.length}
                  </span>
                )}
              </Button>
              <Button
                flex="1"
                variant="ghost"
                leftIcon={<BiChat />}
                onClick={() => onCommentOpen()}
              >
                {comments.length}
              </Button>
              <Modal isCentered isOpen={isCommentOpen} onClose={onCommentClose}>
                {overlay}
                <ModalContent>
                  <ModalHeader>Comments</ModalHeader>
                  <ModalCloseButton />
                  <Divider />
                  <ModalBody pb={6}>
                    {comments.map((comment: any, index: number) => (
                      <div key={index}>
                        <div className="flex flex-row items-center gap-5">
                          <div className="flex flex-col gap-2 m-3">
                            <Avatar
                              name={post.displayName}
                              src={comment.photoUrl}
                            />
                            {/* <img width={"30px"} src={comment.photoUrl} /> */}
                            <p>{comment.userdata}</p>
                          </div>
                          <p>{comment.comment}</p>
                        </div>
                        <Divider />
                      </div>
                    ))}
                  </ModalBody>

                  <ModalFooter className="flex flex-row gap-5">
                    <FormControl>
                      <Input
                        ref={initialRef}
                        value={commentValue}
                        onChange={(e: any) => setCommentValue(e.target.value)}
                        placeholder="Write here"
                      />
                    </FormControl>
                    <Button onClick={handleComment} colorScheme="blue" mr={3}>
                      Send
                    </Button>
                    {/* <Button onClick={onCommentClose}>Cancel</Button> */}
                  </ModalFooter>
                </ModalContent>
              </Modal>
              {/* {comments.length > 0 && (
    <span className="text-sm">{comments.length}</span>
  )} */}
            </CardFooter>
          </Card>
        )}
    </>
  );
}
