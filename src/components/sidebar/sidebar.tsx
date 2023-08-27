import React, { FunctionComponent, useState } from "react";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import type { MenuProps, MenuTheme } from "antd";
import { Button, Menu, Switch } from "antd";
// import "../../styles/CustomTheme.css";

//react-icons
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";

interface SidebarProps {}

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const Sidebar: FunctionComponent<SidebarProps> = () => {
  const [theme, setTheme] = useState<MenuTheme>("light");
  const [current, setCurrent] = useState("1");

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const changeTheme = (value: boolean) => {
    setTheme(value ? "dark" : "light");
  };

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  const items: MenuItem[] = [
    getItem("Home", "1", <AiFillHome />),
    getItem("Profile", "2", <BsPerson />),
    getItem("Option 3", "3", <ContainerOutlined />),

    getItem("Messages", "sub1", <MailOutlined />, [
      getItem("Option 5", "5"),
      getItem("Option 6", "6"),
      getItem("Option 7", "7"),
      getItem("Option 8", "8"),
    ]),

    getItem("Notifications", "sub2", <IoMdNotificationsOutline />, [
      getItem("Option 9", "9"),
      getItem("Option 10", "10"),

      getItem("Submenu", "sub3", null, [
        getItem("Option 11", "11"),
        getItem("Option 12", "12"),
      ]),
    ]),
    // getItem(
    //   <Switch
    //     checked={theme === "dark"}
    //     onChange={changeTheme}
    //     checkedChildren="Dark"
    //     unCheckedChildren="Light"
    //   />
    // ),
    // getItem(
    //   <Button
    //     type="primary"
    //     onClick={toggleCollapsed}
    //     style={{ marginBottom: 16 }}
    //   >
    //     {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    //   </Button>
    // ),
  ];

  return (
    <>
      <div className="w-[250px]">
        <Menu
          className="h-[100vh] "
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          theme={theme}
          inlineCollapsed={collapsed}
          selectedKeys={[current]}
          items={items}
        />
      </div>
    </>
  );
};

export default Sidebar;
