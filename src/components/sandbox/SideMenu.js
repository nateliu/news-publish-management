import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import {
    UserOutlined,
    HomeOutlined,
    CrownOutlined,
} from '@ant-design/icons';

import './index.css'
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';

const { Sider } = Layout;
const { SubMenu } = Menu;

const iconList = {
    '/home': <HomeOutlined />,
    '/user-manage': <UserOutlined />,
    '/user-manage/list': <UserOutlined />,
    '/right-manage': <CrownOutlined />,
    '/right-manage/role/list': <CrownOutlined />,
    '/right-manage/right/list': <CrownOutlined />,
}

export default function SideMenu() {
    const navigate = useNavigate();
    const location = useLocation();

    const selectKeys = [location.pathname]; 
    const openKeys = ["/" + location.pathname.split("/")[1]];

    const [menuList, setMenuList] = useState([]);

    const checkPagePermission = (item) => {
        return item.pagepermission === 1
    }

    const renderMenu = (menuList) => {
        return menuList.map(item => {
            if (item.children?.length > 0 && checkPagePermission(item)) {
                return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
                    {renderMenu(item.children)}
                </SubMenu>
            }
            return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => navigate(item.key)}>
                {item.title}</Menu.Item>
        })
    }

    useEffect(() => {
        axios.get("/api/rights?_embed=children").then(res => {
            // console.log(res.data)
            setMenuList(res.data);
        })
    }, [])

    return (
        <Sider trigger={null} collapsible collapsed={false}>
            <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                <div className="logo">News Publish Management</div>
                <div style={{ flex: 1, 'overflow': 'auto' }}>
                    <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
                        {renderMenu(menuList)}
                    </Menu>
                </div>
            </div>
        </Sider>
    )
}
