import { Table, Button, notification } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Audit() {
    const [dataSource, setDataSource] = useState([])

    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'));

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
            }
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: category => {
                return category.title
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '操作',
            render: item => {
                return <div>
                    <Button type='primary' onClick={() => handleAudit(item, 2, 1)}>通过</Button>
                    <Button onClick={() => handleAudit(item, 3, 0)} >驳回</Button>
                </div>
            }
        },
    ];

    const handleAudit = (item, auditState, publishState) => {
        setDataSource(dataSource.filter(data => data.id !== item.id));

        axios.patch(`/api/news/${item.id}`, {
            auditState,
            publishState
        }).then(res=>{
            notification.info({
                message: `Notification`,
                description:
                    `Please go to auditList for reviewing your news`,
                placement: 'bottomRight',
            });
        })
    }

    useEffect(() => {
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor",
        }

        axios.get(`/api/news?auditState=1&_expand=category`).then(res => {
            console.log(res.data);
            const list = res.data;
            setDataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(item => item.username === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
            ]);
        });
    }, [roleId, region, username]);

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />;
        </div>
    )
}
