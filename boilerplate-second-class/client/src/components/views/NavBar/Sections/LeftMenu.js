import React from 'react';
import { Menu } from 'antd';
// eslint-disable-next-line
const SubMenu = Menu.SubMenu;
// eslint-disable-next-line
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>
      <Menu.Item key="mail">
        <a href="/">Home</a>
      </Menu.Item>
      <Menu.Item key="subscription">
        <a href="/subscription">Subscription</a>
      </Menu.Item>    
    </Menu>
  )
}

export default LeftMenu