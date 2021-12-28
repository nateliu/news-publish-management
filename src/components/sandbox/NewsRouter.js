import axios from 'axios'
import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Audit from '../../views/sandbox/audit-manage/Audit'
import AuditList from '../../views/sandbox/audit-manage/AuditList'
import Home from '../../views/sandbox/home/Home'
import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'
import NoPermission from '../../views/sandbox/nopermission/NoPermission'
import Published from '../../views/sandbox/publish-manage/Published'
import Sunset from '../../views/sandbox/publish-manage/Sunset'
import Unpublished from '../../views/sandbox/publish-manage/Unpublished'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'
import UserList from '../../views/sandbox/user-manage/UserList'
import { connect } from 'react-redux'

const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/news-manage/preview/:id": <NewsPreview />,
    "/news-manage/update/:id": <NewsUpdate />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />,
};

function NewsRouter(props) {
    const [BackRouteList, setBackRouteList] = useState([]);

    const checkRoute = item => {
        return LocalRouterMap[item.key] && (item.pagepermission || item.routepermission);
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
        <Spin size='large' spinning={props.isLoading}>
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

                        return null
                    })
                }
                <Route path="/" element={<Navigate replace from="/" to="home" />} />
                <Route path="/*" element={<NoPermission />} />
            </Routes>
        </Spin>
    )
}

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => ({ isLoading });

export default connect(mapStateToProps)(NewsRouter);