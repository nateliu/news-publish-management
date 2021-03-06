import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import NewsEditor from '../../../components/news-manage/NewsEditor';
import style from './News.module.css'
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd() {
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const User = JSON.parse(localStorage.getItem('token'));

    const [current, setCurrent] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [formInfo, setFormInfo] = useState({});
    const [content, setContent] = useState('')

    const newsForm = useRef(null);
    const navigate = useNavigate();

    const handlePrevious = () => {
        setCurrent(current - 1);
    }

    const handleNext = () => {
        if (current === 0) {
            newsForm.current.validateFields().then(res => {
                // console.log(res);
                setFormInfo(res);
                setCurrent(current + 1);
            }).catch(err => {
                console.log(err);
            })
        } else {
            // console.log(formInfo,content);
            if (content === '' || content.trim() === '<p></p>') {
                message.error(`News content can not be empty!`);
            } else {
                setCurrent(current + 1);
            }
        }
    }

    const handleSave = auditState => {
        axios.post('/api/news', {
            ...formInfo,
            "author": User.username,
            "region": User.region ? User.region : 'Global',
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "content": content,
            "createTime": Date.now(),
            "star": 0,
            "view": 0
        }).then(res => {
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list', { replace: true });
            notification.info({
                message: `Notification`,
                description:
                    `Please go to ${auditState === 0 ? "draft box" : "audit box"} for reviewing your news`,
                placement: 'bottomRight',
            });
        });
    }

    useEffect(() => {
        axios.get(`/api/categories`).then(res => {
            // console.log(res.data);
            setCategoryList(res.data);
        })
    }, []);

    return (
        <div>
            <PageHeader
                className="site-page-header"
                onBack={() => null}
                title="Add news"
                subTitle="This is for adding news"
            />
            <Steps current={current}>
                <Step title="????????????" description="???????????????????????????" />
                <Step title="????????????" description="??????????????????" />
                <Step title="????????????" description="??????????????????????????????" />
            </Steps>
            <div style={{ marginTop: '50px' }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form {...layout} name='basic' ref={newsForm}>
                        <Form.Item name="title" label="????????????" rules={[{ required: true, message: "Please input news title." }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="categoryId" label="????????????" rules={[{ required: true }]}>
                            <Select>
                                {
                                    categoryList.map(item => {
                                        return <Option value={item.id} key={item.id}>{item.title}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </div>
            </div>

            <div className={current === 1 ? '' : style.active}>
                <NewsEditor getContent={value => {
                    // console.log(value);
                    setContent(value);
                }}></NewsEditor>
            </div>

            <div className={current === 2 ? '' : style.active}>
            </div>

            <div style={{ marginTop: '50px' }}>
                {current > 0 && <Button onClick={handlePrevious}> ?????????</Button>}
                {current < 2 && <Button type='primary' onClick={handleNext}> ?????????</Button>}
                {
                    current === 2 && <sapn>
                        <Button type='primary' onClick={() => handleSave(0)}>???????????????</Button>
                        <Button danger onClick={() => handleSave(1)}>????????????</Button>
                    </sapn>
                }
            </div>
        </div>
    )
}
