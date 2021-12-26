import { Button, Table, Modal, Switch } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import UserForm from '../../../components/user-manage/UserForm';
import { update } from 'lodash';

const { confirm } = Modal;


export default function UserList() {
    const [dataSource, setDataSource] = useState([]);
    const [regionList, setRegionList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [addFormVisible, setAddFormVisible] = useState(false)
    const [updateFormVisible, setUpdateFormVisible] = useState(false);
    const [updateDisableRegion, setUpdateDisableRegion] = useState(false);
    const [updateCurrent, setUpdateCurrent] = useState(null);
    const addForm = useRef(null);
    const updateForm = useRef(null);

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item => ({
                    text: item.title,
                    value: item.value
                })),
                {
                    text: 'Global',
                    value: ''
                }
            ],
            onFilter: (value, item) => item.region === value,
            render: (region) => <b>{region === '' ? 'Global' : region}</b>
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: role => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => handleUserState(item)} ></Switch>
            }
        },
        {
            title: '操作',
            render: item => {
                return <div>
                    <Button danger shape='circle' icon={<DeleteOutlined />} disabled={item.default} onClick={() => confirmDelete(item)} />

                    <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={item.default} onClick={() => handUpdate(item)} />
                </div>
            }
        },
    ];

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
        axios.delete(`/api/users/${item.id}`);
    }

    const addFormOk = () => {
        // console.log(addForm);
        addForm.current.validateFields().then(value => {
            // console.log(value)
            setAddFormVisible(false);

            addForm.current.resetFields();

            axios.post(`/api/users`, {
                ...value,
                'roleState': true,
                'default': false,
            }).then(res => {
                // console.log(res.data);
                setDataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === value.roleId)[0]
                }]);
            })
        }).catch(err => {
            console.log(err);
        })
    }

    const updateFormOk = () => {
        // console.log(addForm);
        updateForm.current.validateFields().then(value => {
            // console.log(value)
            setUpdateFormVisible(false);

            setDataSource(dataSource.map(item => {
                if (item.id === updateCurrent.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item;
            }));
            setUpdateDisableRegion(!updateDisableRegion);

            axios.patch(`/api/users/${updateCurrent.id}`, value);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleUserState = (item) => {
        // console.log(item);
        item.roleState = !item.roleState;
        setDataSource([...dataSource])
        axios.patch(`/api/users/${item.id}`, { roleState: item.roleState });
    }

    const handUpdate = (item) => {
        // react update state is asynized. So made a treat here
        setTimeout(() => {
            setUpdateFormVisible(true);
            if (item.roleId === 1) {
                //disable region, communicate between parent and child component
                setUpdateDisableRegion(true);
            } else {
                //undisable region, communicate between parent and child component
                setUpdateDisableRegion(false);
            }
            updateForm.current.setFieldsValue(item);
        }, 0);

        setUpdateCurrent(item);
    }

    useEffect(() => {
        axios.get(`/api/users?_expand=role`).then(res => {
            // console.log(res.data);
            setDataSource(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`/api/regions`).then(res => {
            // console.log(res.data);
            setRegionList(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`/api/roles`).then(res => {
            // console.log(res.data);
            setRoleList(res.data);
        })
    }, []);

    return (
        <div>
            <Button type='primary' onClick={() => setAddFormVisible(true)}>Add new user</Button>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} />;
            <Modal
                visible={addFormVisible}
                title="Create a new user"
                okText="Create"
                cancelText="Cancel"
                onCancel={() => setAddFormVisible(false)}
                onOk={() => addFormOk()}>
                <UserForm regionList={regionList} roleList={roleList} ref={addForm} />
            </Modal>
            <Modal
                visible={updateFormVisible}
                title="Update user"
                okText="Update"
                cancelText="Cancel"
                onCancel={() => {
                    setUpdateFormVisible(false);
                    setUpdateDisableRegion(!updateDisableRegion);
                }}
                onOk={() => updateFormOk()}>
                <UserForm regionList={regionList} roleList={roleList} updateDisableRegion={updateDisableRegion} ref={updateForm} />
            </Modal>
        </div>
    )
}