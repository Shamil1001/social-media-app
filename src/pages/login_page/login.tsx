import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "antd";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Heading,
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { handleLogin } from "../../shared/store/login_store/store/store";

import NavbarLogin from "@/components/navbar_login/navbar_login";

const Login = () => {
  const [loginInformation, setLoginInformation] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const loginError = useSelector((state: any) => state.login.loginError);

  // console.log(loginError);
  const dispatch = useDispatch();

  const handleLog = () => {
    if (
      loginInformation.email.length === 0 ||
      loginInformation.password.length === 0
    ) {
      toast.error("Please, fill the blanks");
      // setError("Please, fill the blanks");
    } else if (!loginInformation.email.includes("@")) {
      // setError("Email or password error");
      toast.error("Email or password error");
    } else {
      dispatch(handleLogin(loginInformation));
    }
  };
  const handlePress = (e: any) => {
    if (e.key == "Enter") {
      handleLog();
    }
  };

  return (
    <>
      <NavbarLogin />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col items-center justify-center w-full h-[90vh]">
        <Card
          boxShadow="2xl"
          style={{
            width: 350,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 className="text-3xl text-center mb-[20px] mt-5">Login</h1>

          <p className="text-red-500">{error}</p>

          <CardBody>
            <div className="flex flex-col gap-[15px]">
              <Input
                placeholder="*****@gmail.com"
                value={loginInformation.email}
                onChange={(e) =>
                  setLoginInformation({
                    ...loginInformation,
                    email: e.target.value,
                  })
                }
              />
              <Input.Password
                placeholder="1234****"
                value={loginInformation.password}
                onKeyDown={(e) => handlePress(e)}
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                onChange={(e) =>
                  setLoginInformation({
                    ...loginInformation,
                    password: e.target.value,
                  })
                }
              />

              <Button colorScheme="blue" onClick={handleLog}>
                Login
              </Button>
            </div>
            {/* <div className="flex flex-row items-center justify-center gap-2 mt-5 cursor-pointer hover:text-blue-700">
              <FcGoogle className="text-[20px]" />
              <h2 onClick={() => signIn("google")}>Sign in with Google</h2>
            </div> */}
          </CardBody>

          <CardFooter>
            <Link href="/register/register">
              <p className="text-blue-500 hover:text-blue-900 text-center mt-[20px] ">
                Create account
              </p>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;
