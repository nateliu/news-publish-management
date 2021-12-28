import { Button, Table, Tag, notification } from 'antd';

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

export default function AuditList() {
    const { username } = JSON.parse(localStorage.getItem('token'));

    const [dataSource, setDataSource] = useState([]);

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
            title: '审核状态',
            dataIndex: 'auditState',
            render: auditState => {
                const colorList = ['', 'orange', 'green', 'red'];
                const auditList = ['未审核', '审核中', '已通过', '未通过'];
                return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
            }
        },
        {
            title: '操作',
            render: item => {
                return <div>
                    {
                        item.auditState === 1 && <Button danger onClick={() => handleRevert(item)}>撤销</Button>
                    }
                    {
                        item.auditState === 2 && <Button onClick={() => handlePublish(item)}>发布</Button>
                    }
                    {
                        item.auditState === 3 && <Button type='primary' onClick={() => handleUpdate(item)}>更新</Button>
                    }
                </div>
            }
        },
    ];

    const navigate = useNavigate();

    const handleRevert = item => {
        setDataSource(dataSource.filter(data => data.id !== item.id));

        axios.patch(`/api/news/${item.id}`, {
            auditStats: 0
        }).then(res => {
            navigate('/news-manage/draft');
            notification.info({
                message: `Notification`,
                description:
                    `Please go to draft box for reviewing your news`,
                placement: 'bottomRight',
            });
        })
    }

    const handleUpdate = item => {
        navigate(`/news-manage/update/${item.id}`);
    }

    const handlePublish = item => {
        axios.patch(`/api/news/${item.id}`, {
            publishStats: 2,
            publishTime: Date.now()
        }).then(res => {
            navigate('/publish-manage/published');
            notification.info({
                message: `Notification`,
                description:
                    `Please go to published box for reviewing your news`,
                placement: 'bottomRight',
            });
        })
    }

    useEffect(() => {
        axios.get(`/api/news?_expand=category&author=${username}&auditState_ne=0&publishState_lte=1`).then(res => {
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
