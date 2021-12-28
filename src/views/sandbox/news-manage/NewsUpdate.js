import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router';
import NewsEditor from '../../../components/news-manage/NewsEditor';
import style from './News.module.css'
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate() {
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const [current, setCurrent] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [formInfo, setFormInfo] = useState({});
    const [content, setContent] = useState('')

    const newsForm = useRef(null);
    const navigate = useNavigate();
    const params = useParams();

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
        axios.patch(`/api/news/${params.id}`, {
            ...formInfo,
            "auditState": auditState,
            "content": content,
        }).then(res => {
            navigate(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list');
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

    useEffect(() => {
        // console.log(props.match.params.id)
        axios.get(`/api/news/${params.id}?_expand=category&_expand=role`).then(res => {
            // console.log(res.data);
            // setNewsInfo(res.data);
            // content
            // formInfo
            const { title, categoryId, content } = res.data;

            newsForm.current.setFieldsValue({
                title,
                categoryId
            });
            setContent(content);
        })
    }, [params.id]);

    return (
        <div>
            <PageHeader
                className="site-page-header"
                onBack={() => navigate('/news-manage/draft')}
                title="Update news"
                subTitle="This is for update news"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            <div style={{ marginTop: '50px' }}>
                <div className={current === 0 ? '' : style.active}>
                    <Form {...layout} name='basic' ref={newsForm}>
                        <Form.Item name="title" label="新闻标题" rules={[{ required: true, message: "Please input news title." }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="categoryId" label="新闻分类" rules={[{ required: true }]}>
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
                }} content={content}></NewsEditor>
            </div>

            <div className={current === 2 ? '' : style.active}>
            </div>

            <div style={{ marginTop: '50px' }}>
                {current > 0 && <Button onClick={handlePrevious}> 上一步</Button>}
                {current < 2 && <Button type='primary' onClick={handleNext}> 下一步</Button>}
                {
                    current === 2 && <sapn>
                        <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </sapn>
                }
            </div>
        </div>
    )
}