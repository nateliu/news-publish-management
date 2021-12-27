import { Button, Table, Tag, Modal, Popover, Switch } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

import axios from 'axios';
import React, { useEffect, useState } from 'react'

const { confirm } = Modal;

export default function RightList() {
    const [dataSource, setDataSource] = useState([]);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => {
                return <Tag color='orange'>{key}</Tag>
            }
        },
        {
            title: '操作',
            render: item => {
                return <div>
                    <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmDelete(item)} />
                    <Popover
                        content={<div style={{ textAlign: 'center' }}>
                            <Switch checked={item.pagepermission} onChange={() => swithPageConfiguration(item)}></Switch>
                        </div>}
                        title="Page configuration" trigger={item.pagepermission === undefined ? '' : 'click'}>
                        <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.pagepermission === undefined} />
                    </Popover>
                </div>
            }
        },
    ];

    const swithPageConfiguration = item => {
        // console.log(item);
        item.pagepermission = item.pagepermission === 1 ? 0 : 1;
        setDataSource([...dataSource])
        if (item.grade === 1) {
            axios.patch(`/api/rights/${item.id}`, { pagepermission: item.pagepermission });
        } else {
            axios.patch(`/api/children/${item.id}`, { pagepermission: item.pagepermission });
        }
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
        if (item.grade === 1) {
            setDataSource(dataSource.filter(data => data.id !== item.id));
            axios.delete(`/api/rights/${item.id}`);
        } else {
            const list = dataSource.filter(data => data.id === item.rightId);
            list[0].children = list[0].children.filter(data => data.id !== item.id);
            setDataSource([...dataSource]);
            axios.delete(`/api/children/${item.id}`);
        }

    }

    useEffect(() => {
        axios.get(`/api/rights?_embed=children`).then(res => {
            // console.log(res.data);
            res.data.forEach((item) => item.children?.length === 0 ? item.children = "" : item.children);
            setDataSource(res.data);
        })
    }, []);

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />;
        </div>
    )
}
