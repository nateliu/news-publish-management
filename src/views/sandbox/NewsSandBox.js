import { Layout } from 'antd'
import React, { useEffect } from 'react'
import NewsRouter from '../../components/sandbox/NewsRouter'
import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import nProgress from 'nprogress'

import 'nprogress/nprogress.css'
import './NewsSandBox.css'

const { Content } = Layout;

export default function NewsSandBox() {
    nProgress.start();
    useEffect(() => {
        nProgress.done();
    }, []);

    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto',
                    }}>
                        <NewsRouter></NewsRouter>
                </Content>
            </Layout>
        </Layout>
    )
}
