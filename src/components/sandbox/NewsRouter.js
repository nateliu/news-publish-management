import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Home from '../../views/sandbox/home/Home'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'

const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />,
};

export default function NewsRouter() {
    const [BackRouteList, setBackRouteList] = useState([]);

    const checkRoute = item => {
        return LocalRouterMap[item.key] && item.pagepermission;
    }

    const checkUserPermission = item => {
        return rights.includes(item.key);
    }

    const { role: { rights } } = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        Promise.all([
            axios.get(`/api/rights`),
            axios.get(`/api/children`),
        ]).then((res) => {
            // console.log(res.data);
            setBackRouteList([...res[0].data, ...res[1].data]);
        });
    }, []);

    return (
        <Routes>
            {
                BackRouteList.map(item => {
                    if (checkRoute(item) && checkUserPermission(item)) {
                        return <Route
                            path={item.key}
                            key={item.key}
                            element={LocalRouterMap[item.key]}
                        />
                    }

                    <Route path="/*" element={<NoPermission />} />
                })
            }
            <Route path="/" element={<Navigate replace from="/" to="home" />} />
            <Route path="/*" element={<NoPermission />} />
        </Routes>

    )
}
