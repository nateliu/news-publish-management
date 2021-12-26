import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
    const [isDisableRegion, setIsDisableRegion] = useState(false);

    useEffect(() => {
        setIsDisableRegion(props.updateDisableRegion);
    }, [props.updateDisableRegion]);
    
    return (
        <Form layout="vertical" ref={ref} >
            <Form.Item
                name="username"
                label="User Name"
                rules={[{ required: true, message: 'Please input the user name!' }]}>
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input the password!' }]}>
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="Region"
                rules={isDisableRegion ? [] : [{ required: true, message: 'Please input the region!' }]}>
                <Select disabled={isDisableRegion}>
                    {
                        props.regionList.map(item =>
                            <Option value={item.value} key={item.id}>{item.title}</Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="Role"
                rules={[{ required: true, message: 'Please input the role!' }]}>
                <Select onChange={(value) => {
                    if (value === 1) {
                        setIsDisableRegion(true);
                        ref.current.setFieldsValue({ region: '' });
                    } else {
                        setIsDisableRegion(false);
                    }
                }}>
                    {
                        props.roleList.map(item =>
                            <Option value={item.id} key={item.id}>{item.roleName}</Option>
                        )
                    }
                </Select>
            </Form.Item>
        </Form>
    )
});
export default UserForm;
