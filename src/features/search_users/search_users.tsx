import { Card, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { Avatar } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  handleSelectUser,
  handleSelectId,
} from "@/shared/store/friends-store/store";

export default function SearchUsers() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [userData, setUserData] = useState([]);
  const [docIds, setDocIds] = useState<any>([]);
  const currentUser: any = auth.currentUser;
  const dispatch = useDispatch();

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot: any) => {
        const fetchSearch = snapshot.docs.map((doc: any) => doc.data());
        setSearchResult(fetchSearch);
        const docIds = snapshot.docs.filter((doc: any) => {
          return doc.data();
        });
        setDocIds(docIds);
      }),

    [db]
  );

  const handleSearch = (event: any) => {
    const { value } = event.target;
    setSearch(value);
    const filteredResults = searchResult?.filter(
      (user: any) =>
        user.displayName.toLowerCase().includes(value.toLowerCase()) &&
        user.uid !== currentUser.uid
    );
    console.log(filteredResults);
    setUserData(filteredResults);
  };

  const handleSelectSearchData = (user: any) => {
    dispatch(handleSelectUser(user));
    const filteredIds = docIds.filter((doc: any) => {
      return doc.data().uid == user.uid;
    });
    dispatch(handleSelectId(filteredIds[0].id));
    // console.log("filteredIds", filteredIds[0].id);
    setSearch("");
  };

  return (
    <>
      <div className="width-[40px]">
        <Input
          value={search}
          onChange={handleSearch}
          placeholder="Search friends"
        />

        {search.length !== 0 && userData && (
          <Card
            // w="20%"
            minW={210}
            mt="10px"
            p="10px"
            position="absolute"
            flex="flex-col"
            gap="10px"
          >
            {userData.map((user: any, index: number) => (
              <div
                className="flex flex-row items-center w-full gap-5 group hover:bg-green-200"
                key={index}
                onClick={() => handleSelectSearchData(user)}
              >
                <Avatar size="sm" src={user.photoUrl} />
                <h2 className="w-full cursor-pointer">{user.displayName}</h2>
              </div>
            ))}
          </Card>
        )}
      </div>
    </>
  );
}
