import React, { useEffect, useState } from "react";
import { onSnapshot, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import Post from "../posts/posts";

interface PostData {
  postData: any[];
  documentIds: string[];
}

const Feed = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot: any) => {
      const fetchedPosts = snapshot.docs.map((doc: any) => doc.data());
      const ids = snapshot.docs.map((doc: any) => doc.id);
      // console.log("fetchedPosts", fetchedPosts);
      setPosts([...posts, { postData: fetchedPosts, documentIds: ids }]);
    });
    return () => {
      unsubscribe();
    };
  }, [db]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot: any) => {
      const fetchedUsers = snapshot.docs.map((doc: any) => doc.data());
      const c = fetchedUsers.filter((user: any) =>
        user.followers.includes(auth.currentUser?.uid)
      );

      setUserData(fetchedUsers);
    });
    return () => {
      unsubscribe();
    };
  }, [db]);

  return (
    <div className="relative z-0 flex flex-col items-center gap-4 mt-4">
      {posts.length > 0 &&
        posts[0].postData?.map((post: any, index: number) => (
          <Post
            key={index}
            post={post}
            userData={userData}
            documentId={posts[0].documentIds[index]}
          />
        ))}
    </div>
  );
};

export default Feed;
