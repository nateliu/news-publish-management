import React from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './Login.css'
import Particles from "react-tsparticles";
import axios from 'axios';
import { useNavigate } from 'react-router';

export default function Login() {
    const navigate = useNavigate();

    const onFormFinish = (values) => {
        // console.log(values);

        //Because the limition of Json-server, here we chose verb get. we should use post in real db.
        axios.get(`/api/users?_expand=role&username=${values.username}&password=${values.password}&roleState=true`).then(res => {
            // console.log(res.data);
            if (res.data.length === 0) {
                message.error(`UserName or Password is wrong!`)
            } else {
                localStorage.setItem('token', JSON.stringify(res.data[0]));
                navigate('/');
            }
        })
    };

    return (
        <div style={{ background: 'rgb(35,39,65', height: "100%" }}>
            <Particles
                id="tsparticles"
                options={{
                    "background": {
                        "color": {
                            "value": "#0d47a1"
                        },
                        "position": "50% 50%",
                        "repeat": "no-repeat",
                        "size": "cover"
                    },
                    "fullScreen": {
                        "zIndex": 1
                    },
                    "interactivity": {
                        "events": {
                            "onClick": {
                                "enable": true,
                                "mode": "push"
                            },
                            "onHover": {
                                "enable": true,
                                "mode": "grab",
                                "parallax": {
                                    "enable": true,
                                    "force": 60
                                }
                            }
                        },
                        "modes": {
                            "bubble": {
                                "distance": 400,
                                "duration": 2,
                                "opacity": 0.8,
                                "size": 40
                            },
                            "grab": {
                                "distance": 400
                            }
                        }
                    },
                    "particles": {
                        "color": {
                            "value": "#ffffff"
                        },
                        "links": {
                            "color": {
                                "value": "#ffffff"
                            },
                            "distance": 150,
                            "enable": true,
                            "opacity": 0.4
                        },
                        "move": {
                            "attract": {
                                "rotate": {
                                    "x": 600,
                                    "y": 1200
                                }
                            },
                            "enable": true,
                            "outModes": {
                                "bottom": "out",
                                "left": "out",
                                "right": "out",
                                "top": "out"
                            }
                        },
                        "number": {
                            "density": {
                                "enable": true
                            }
                        },
                        "opacity": {
                            "random": {
                                "enable": true
                            },
                            "value": {
                                "min": 0.1,
                                "max": 0.5
                            },
                            "animation": {
                                "enable": true,
                                "speed": 3,
                                "minimumValue": 0.1
                            }
                        },
                        "size": {
                            "random": {
                                "enable": true
                            },
                            "value": {
                                "min": 0.1,
                                "max": 10
                            },
                            "animation": {
                                "enable": true,
                                "speed": 20,
                                "minimumValue": 0.1
                            }
                        }
                    }
                }}
            />

            <div className='formContainer'>
                <div className='loginTitle'> News Publish Management</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFormFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>

    );
}
