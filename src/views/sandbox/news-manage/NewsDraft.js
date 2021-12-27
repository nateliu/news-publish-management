import { Button, Table, Modal, notification } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    UploadOutlined,
} from '@ant-design/icons';

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

const { confirm } = Modal;

export default function NewsDraft() {
    const [dataSource, setDataSource] = useState([]);

    const navigate = useNavigate();

    const { username } = JSON.parse(localStorage.getItem('token'));

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
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
                    <Button shape='circle' icon={<DeleteOutlined />} onClick={() => confirmDelete(item)} />
                    <Button type='primary' shape='circle' icon={<EditOutlined />} onClick={() => {
                        navigate(`/news-manage/update/${item.id}`)
                    }} />
                    <Button danger shape='circle' icon={<UploadOutlined />} onClick={() => handleAudit(item.id)} />

                </div>
            }
        },
    ];

    const handleAudit = id => {
        axios.patch(`/api/news/${id}`, {
            auditState: 1
        }).then(res => {
            navigate('/audit-manage/list');
            notification.info({
                message: `Notification`,
                description:
                    `Please go to audit box for checking your news`,
                placement: 'bottomRight',
            });
        });
    }

    const confirmDelete = item => {
        confirm({
            title: 'Do you Want to delete this item?',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                // console.log('OK');
                realDelete(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const realDelete = (item) => {
        // console.log(item);
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/api/news/${item.id}`);
    }

    useEffect(() => {
        axios.get(`/api/news?_expand=category&author=${username}&auditState=0`).then(res => {
            // console.log(res.data);
            setDataSource(res.data);
        })
    }, [username]);

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />;
        </div>
    )
}
