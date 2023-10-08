import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Input, Modal, Upload, message } from "antd";
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import toast, { Toaster } from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Heading,
} from "@chakra-ui/react";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  handleUploadUserData,
  handleSelectFile,
} from "../../shared/store/register_store/store/store";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import NavbarLogin from "@/components/navbar_login/navbar_login";
import { BsFillImageFill } from "react-icons/bs";

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Register = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [error, setError] = useState("");
  const [registerInformation, setRegisterInformation] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const registerError = useSelector(
    (state: any) => state.register.registerError
  );

  const handleRegister = () => {
    if (
      registerInformation.email.length == 0 ||
      registerInformation.password.length == 0 ||
      registerInformation.username.length == 0
    ) {
      // setError("Please, fill the blanks");
      toast.error("Please, fill the blanks");
    } else if (!registerInformation.email.includes("@")) {
      // setError("Email or password error");
      toast.error("Email or password error");
    } else if (
      registerInformation.password !== registerInformation.confirmPassword
    ) {
      toast.error("Password error");
      // setError("Password error");
    } else {
      dispatch(handleUploadUserData(registerInformation));
    }
  };

  const handlePress = (e: any) => {
    if (e.key == "Enter") {
      handleRegister();
    }
  };

  return (
    <>
      <NavbarLogin />
      <Toaster position="top-right" reverseOrder={false} />
      <main className="relative max-w-[1400px] h-[90vh] mx-auto">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Card
            // bordered={false}
            boxShadow="2xl"
            style={{
              width: 350,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              // border: "1px solid gray",
            }}
          >
            <h1 className="text-3xl text-center mb-[20px] mt-5">Register</h1>
            <div className="flex items-center justify-center mb-3">
              <label htmlFor="file" className="flex flex-row gap-6">
                {/* <Button>Add file</Button> */}
                <span className="p-2 text-white bg-blue-400 rounded cursor-pointer hover:bg-blue-500">
                  Select image
                </span>
                {/* <BsFillImageFill className="text-3xl cursor-pointer" /> */}
              </label>
              <input
                multiple
                type="file"
                id="file"
                hidden
                onChange={(files) =>
                  dispatch(handleSelectFile(files.target.files))
                }
              />
              {/* <input
                type="file"
                placeholder="click here"
                accept="image/jpg"
                onChange={(files) =>
                  dispatch(handleSelectFile(files.target.files))
                }
              /> */}
              {/* <Upload
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload> */}
            </div>
            {error.length !== 0 && <p className="text-red-500">{error}</p>}
            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={handleCancel}
            >
              <Image
                alt="example"
                style={{ width: "100%" }}
                src={previewImage}
              />
            </Modal>

            <div className="flex flex-col gap-[15px]">
              <Input
                placeholder="Username"
                value={registerInformation.username}
                // prefix={<UserOutlined />}
                onChange={(e) =>
                  setRegisterInformation({
                    ...registerInformation,
                    username: e.target.value,
                  })
                }
              />
              <Input
                placeholder="email"
                value={registerInformation.email}
                onChange={(e) =>
                  setRegisterInformation({
                    ...registerInformation,
                    email: e.target.value,
                  })
                }
              />
              <Input.Password
                placeholder="password"
                value={registerInformation.password}
                onChange={(e) =>
                  setRegisterInformation({
                    ...registerInformation,
                    password: e.target.value,
                  })
                }
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
              <Input.Password
                placeholder="confirm password"
                value={registerInformation.confirmPassword}
                onKeyDown={(e) => handlePress(e)}
                onChange={(e) =>
                  setRegisterInformation({
                    ...registerInformation,
                    confirmPassword: e.target.value,
                  })
                }
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
              <Button colorScheme="blue" onClick={handleRegister}>
                Register
              </Button>
            </div>

            <CardFooter>
              <Link href="/">
                <p className=" text-blue-500 text-center mt-[20px] hover:text-blue-900">
                  Already have account
                </p>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Register;
