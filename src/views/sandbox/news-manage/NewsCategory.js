import { Button, Table, Modal, Form, Input } from 'antd';
import {
    DeleteOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

import axios from 'axios';
import React, { useContext, useState, useEffect, useRef } from 'react'

const { confirm } = Modal;

export default function NewsCategory() {
    const [dataSource, setDataSource] = useState([]);

    const EditableContext = React.createContext(null);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>
        },
        {
            title: '分类名称',
            dataIndex: 'title',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '分类名称',
                handleSave: handleCellSave,
            }),
        },
        {
            title: '操作',
            render: item => {
                return <div>
                    <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmDelete(item)} />
                </div>
            }
        },
    ];

    const handleCellSave = record => {
        // console.log(record);
        setDataSource(dataSource.map(item => {
            if (item.id === record.id) {
                return {
                    id: item.id,
                    title: record.title,
                    value: record.title,
                }
            }
            return item;
        }))

        axios.patch(`/api/categories/${record.id}`, {
            title: record.title,
            value: record.title,
        })
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
        axios.delete(`/api/categories/${item.id}`);
    }

    useEffect(() => {
        axios.get(`/api/categories`).then(res => {
            // console.log(res.data);
            setDataSource(res.data);
        })
    }, []);

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };

        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({ ...record, ...values });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;

        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }

        return <td {...restProps}>{childNode}</td>;
    };

    return (
        <div>
            <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={item => item.id} components={{
                body: {
                    row: EditableRow,
                    cell: EditableCell,
                },
            }} />;
        </div>
    )
}