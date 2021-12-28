import { Button } from 'antd';
import React from 'react';
import NewsPublish from '../../../components/publish-manage/NewsPublish';
import usePublish from '../../../components/publish-manage/usePublish';

export default function Unpublished() {
    // 1 unpublished
    // 2 published
    // 3 sunset
    const { dataSource, handlePublish } = usePublish(1);
    return (
        <div>
            <NewsPublish dataSource={dataSource} button={id => <Button type='primary' onClick={() => handlePublish(id)}>发布</Button>}></NewsPublish>
        </div>
    )
}
