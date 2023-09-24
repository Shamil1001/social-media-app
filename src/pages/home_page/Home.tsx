/* eslint-disable @next/next/no-img-element */
import Feed from "@/components/feed/feed";
import Navbar from "@/components/navbar/navbar";
import { CardBody, Card, Avatar, Textarea, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { BsFillImageFill, BsEmojiSmile } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { IUser_Data } from "@/shared/types/IUser_Data";
import { useDispatch, useSelector } from "react-redux";

export default function HomePage() {
  const [user, setUser] = useState<IUser_Data>();
  const { data: session } = useSession();
  const [selectFile, setSelectedFile] = useState(null);
  const [postText, setPostText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [currentDocId, setCurrentDocId] = useState("");
  const [currentUserPosts, setCurrentUserPosts] = useState<string[]>([]);

  const dispatch = useDispatch();
  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      setUser(user);
    });
  }, []);

  // const selectFile = useSelector((state: any) => {
  //   console.log(state);
  //   return state.home?.selectFile || null;
  // });

  const pickerRef = useRef(null);

  const addImageToPost = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent: any) => {
      setSelectedFile(readerEvent.target?.result);
    };
  };

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const filteredId = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == auth.currentUser?.uid;
        });

        setCurrentDocId(filteredId[0].id);
      }),

    []
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const filteredUser = snapshot.docs.filter((doc: any) => {
          return doc.data().uid == auth.currentUser?.uid;
        });

        setCurrentUserPosts(filteredUser[0].data().posts);
      }),

    []
  );

  const sendPost = async () => {
    const uniqueId = uuidv4();
    const session = { user: { uid: "", name: "", image: "", tag: "" } };
    const docRef = await addDoc(collection(db, "posts"), {
      userId: auth.currentUser?.uid,
      displayName: auth.currentUser?.displayName,
      userImg: auth.currentUser?.photoURL,
      tag: session?.user?.tag,
      text: postText,
      timestampL: serverTimestamp(),
      image: selectFile,
      postId: uniqueId,
    });

    const newPostId = [...currentUserPosts, uniqueId];
    await updateDoc(doc(db, "users", `${currentDocId}`), {
      posts: newPostId,
    });

    setPostText("");
    setSelectedFile(null);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectFile) {
      await uploadString(imageRef, selectFile, "data_url").then(async () => {
        const downloadUrl = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadUrl,
        });
      });
    }
  };

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setPostText(postText + emoji);
  };

  const handlePress = (e: any) => {
    if (e.key == "Enter") {
      sendPost();
    }
  };

  return (
    <>
      {auth.currentUser && (
        <div className="h-[calc(100vh)]">
          <Navbar />
          <div className="flex flex-col items-center mt-5 mb-14">
            <Card maxW={"md"}>
              <CardBody w={"md"}>
                <div className="flex flex-row w-full gap-5">
                  <Avatar size={"md"} src={`${auth.currentUser?.photoURL}`} />
                  {/* <textarea placeholder=></textarea> */}
                  <div className="flex flex-col w-full gap-5">
                    <Textarea
                      maxLength={100}
                      maxH="250px"
                      w={"100%"}
                      onKeyDown={(e) => handlePress(e)}
                      placeholder="What's happening"
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                    />
                    {selectFile && (
                      <div className="relative mb-4">
                        <div
                          onClick={() => setSelectedFile(null)}
                          className="absolute w-8 h-8 bg-[#15181c] hover:[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                        >
                          <AiOutlineCloseCircle />
                        </div>
                        <img
                          src={selectFile}
                          alt=""
                          className="object-contain rounded-2xl max-h-80"
                        />
                      </div>
                    )}
                    <div className="flex flex-row gap-5">
                      <label htmlFor="file">
                        <BsFillImageFill className="cursor-pointer" />
                      </label>
                      <input
                        multiple
                        type="file"
                        id="file"
                        hidden
                        onChange={addImageToPost}
                      />

                      <BsEmojiSmile
                        className="cursor-pointer"
                        onClick={() => setShowEmojis(!showEmojis)}
                      />
                    </div>

                    <Button
                      isDisabled={!postText.trim() && !selectFile}
                      onClick={sendPost}
                    >
                      Post
                    </Button>
                    {showEmojis && (
                      <div
                        ref={pickerRef}
                        className="absolute mt-[30%] -ml-[40px] max-w-[320px] rounded-[20px] z-10"
                      >
                        <Picker
                          onEmojiSelect={addEmoji}
                          data={emojiData}
                          theme="dark"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <Feed />
        </div>
      )}
    </>
  );
}
