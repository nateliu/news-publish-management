import React, { useState } from 'react'

import { Avatar, Dropdown, Layout, Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

export default function TopHeader() {
    const [collapsed, setCollapsed] = useState(false)

    const changeCollapsed = () => {
        setCollapsed(!collapsed)
    }

    const menu = (
        <Menu>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              1st menu item
            </a>
          </Menu.Item>
          <Menu.Item disabled>
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              2nd menu item (disabled)
            </a>
          </Menu.Item>
          <Menu.Item disabled>
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
              3rd menu item (disabled)
            </a>
          </Menu.Item>
          <Menu.Item danger>Login out</Menu.Item>
        </Menu>
      );
    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}
            <div style={{ float: "right" }} >
                <span>Wellcome back Admin</span>
                <Dropdown overlay={menu}>
                    <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}
