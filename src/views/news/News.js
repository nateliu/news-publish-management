import { PageHeader, Card, Col, Row, List } from 'antd';
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import axios from 'axios';

export default function News() {
    const [list, setList] = useState([]);
    useEffect(() => {
        axios.get(`/api/news?publisthState=2&_expand=category`).then(res => {
            const twoDims = Object.entries(_.groupBy(res.data, item => item.category.title));
            // console.log(twoDims);
            setList(twoDims);
        })
    }, []);

    return (
        <div style={{
            width: "95%",
            margin: "0 auto"
        }}>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16, 16]}>
                    {
                        list.map(item => {
                            return <Col span={8} key={item[0]}>
                                <Card title={item[0]} bordered={true} hoverable={true}>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{
                                            pageSize: 3
                                        }}
                                        renderItem={data => <List.Item>
                                            <a href={`#/detail/${data.id}`}>{data.title}</a>
                                        </List.Item>}
                                    />
                                </Card>
                            </Col>
                        })
                    }
                </Row>
            </div>
        </div>
    )
}
