import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    CrownOutlined,
} from '@ant-design/icons';

import './index.css'
import { useNavigate } from 'react-router';
import axios from 'axios';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function SideMenu() {
    const navigate = useNavigate();
    const [menuList, setMenuList] = useState([]);

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children) {
                return <SubMenu key={item.key} icon={item.icon} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return <Menu.Item key={item.key} icon={item.icon} onClick={() => navigate(item.key)}>
                {item.title}</Menu.Item>
        })
    }

    useEffect(() => {
        axios.get("/api/rights?_embed=children").then(res=>{
            // console.log(res.data)
            setMenuList(res.data);
        })
    }, [])

    return (
        <Sider trigger={null} collapsible collapsed={false}>
            <div className="logo">News Publish Management</div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                {renderMenu(menuList)}
            </Menu>
        </Sider>
    )
}
