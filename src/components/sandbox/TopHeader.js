import React, { useState } from 'react'

import { Avatar, Dropdown, Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router';

const { Header } = Layout;

export default function TopHeader() {
  const [collapsed, setCollapsed] = useState(false)

  const navigate = useNavigate();

  const changeCollapsed = () => {
    setCollapsed(!collapsed);
  }

  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'));

  const menu = (
    <Menu>
      <Menu.Item key='adminMenu'>
        {roleName}
      </Menu.Item>
      <Menu.Item danger key='loginOutMenu' onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>Login out</Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />}
      <div style={{ float: "right" }} >
        <span>Welcome <span style={{ color: '#1890ff' }}> {username}</span></span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
