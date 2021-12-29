import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as ECharts from 'echarts';
import _ from 'lodash';

const { Meta } = Card;

export default function Home() {
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [allList, setAllList] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [barChart, setBarChart] = useState(null);
    const [pieChart, setPieChart] = useState(null);

    const barRef = useRef();
    const pieRef = useRef();

    const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        axios.get(`/api/news?publisthState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
            // console.log(res.data);
            setViewList(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`/api/news?publisthState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
            // console.log(res.data);
            setStarList(res.data);
        })
    }, []);

    useEffect(() => {
        axios.get(`/api/news?publisthState=2&_expand=category`).then(res => {
            // console.log(res.data);
            setAllList(res.data);
            const viewData = _.groupBy(res.data, item => item.category.title);
            // console.log(viewData);
            renderBarView(viewData)
        })

        return () => {
            window.onresize = null;
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const renderBarView = (obj) => {
        const option = {
            title: {
                text: '新闻分类图示'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "45",
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => item.length)
                }
            ]
        };

        let myChart;

        if (!barChart) {
            myChart = ECharts.init(barRef.current);
            setBarChart(myChart)
        } else {
            myChart = barChart;
        }

        myChart.setOption(option);

        window.onresize = () => {
            myChart.resize();
        }
    }

    const renderPieView = (obj) => {
        const currentList = allList.filter(item => item.author === username);
        // console.log(currentList);
        const groupObj = _.groupBy(currentList, item => item.category.title);
        const list = [];
        for (var i in groupObj) {
            list.push({
                name: i,
                value: groupObj[i].length
            })
        }

        const option = {
            title: {
                text: `当前用户${username}的新闻分类图示`,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        let myChart
        if (!pieChart) {
            myChart = ECharts.init(pieRef.current);
            setPieChart(myChart);
        } else {
            myChart = pieChart;
        }

        option && myChart.setOption(option);
    }

    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered={true}>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={item => <List.Item>
                                <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={item => <List.Item>
                                <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                            </List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={() => {
                                setTimeout(() => {
                                    setDrawerVisible(true);
                                    renderPieView();
                                }, 0);

                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : 'Global'}</b>
                                    <span style={{ paddingLeft: "30px" }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>

            <div ref={barRef} style={{
                width: '100%',
                height: '400px',
                marginTop: '30px',
            }}></div>

            <Drawer title="个人新闻分类"
                width='500px'
                placement="right"
                closable={true}
                onClose={() => {
                    setDrawerVisible(false)
                }}
                visible={drawerVisible}>
                <div ref={pieRef} style={{
                    width: '100%',
                    height: '400px',
                    marginTop: '30px',
                }}></div>
            </Drawer>
        </div>
    )
}
