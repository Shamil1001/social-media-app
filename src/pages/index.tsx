import Login from "./login_page/login";

export default function Home() {
  // const { data: session } = useSession();

  return (
    <main className="relative h-[90vh]">
      <Login />
      {/* {auth.currentUser ? <HomePage /> : <Login />} */}
    </main>
  );
}
