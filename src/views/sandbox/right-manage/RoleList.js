import { Button, Table, Modal, Tree } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

import axios from 'axios';
import React, { useEffect, useState } from 'react'

const { confirm } = Modal;

export default function RoleList() {
    const [dataSource, setDataSource] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [currentRights, setCurrentRights] = useState([]);
    const [currentId, setCurrentId] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: item => {
                return <div>
                    <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmDelete(item)} />
                    <Button type='primary' shape='circle' icon={<EditOutlined />} onClick={() => editPermission(item)} />
                </div>
            }
        },
    ];

    const editPermission = item => {
        setIsModalVisible(true);
        setCurrentRights(item.rights);
        setCurrentId(item.id);
    }

    const confirmDelete = item => {
        confirm({
            title: 'Do you Want to delete these items?',
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
        axios.delete(`/api/roles/${item.id}`);
    }

    const handleOk = () => {
        setIsModalVisible(false);
        setDataSource(dataSource.map(item=>{
            if(item.id == currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item;
        }));

        axios.patch(`/api/roles/${currentId}`,{rights:currentRights});
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const handleCheck = (checkedKeys) => {
        // console.log(checkedKeys);
        setCurrentRights(checkedKeys);
    }

    useEffect(() => {
        axios.get(`/api/roles`).then(res => {
            // console.log(res.data);
            setDataSource(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`/api/rights?_embed=children`).then(res => {
            // console.log(res.data);
            setTreeData(res.data)
        })
    }, []);

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />;

            <Modal title="Permisson Configuration" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys={currentRights}
                    onCheck={handleCheck}
                    checkStrictly={true}
                    treeData={treeData}
                />
            </Modal>
        </div>
    )
}
