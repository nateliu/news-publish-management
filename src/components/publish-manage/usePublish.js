
import { useEffect, useState } from 'react'
import axios from 'axios';
import { notification } from 'antd';

export default function usePublish(type) {
    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        axios.get(`/api/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            // console.log(res.data);
            setDataSource(res.data);
        })
    }, [username, type]);

    const handlePublish = id => {
        // console.log(id);
        setDataSource(dataSource.filter(item => item.id !== id));

        axios.patch(`/api/news/${id}`, {
            publishStats: 2,
            publishTime: Date.now(),
        }).then(res => {
            notification.info({
                message: `Notification`,
                description:
                    `Please go to published box for reviewing your news`,
                placement: 'bottomRight',
            });
        })
    }

    const handleSunset = id => {
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.patch(`/api/news/${id}`, {
            publishStats: 3,
        }).then(res => {
            notification.info({
                message: `Notification`,
                description:
                    `Please go to Sunset box for reviewing your news`,
                placement: 'bottomRight',
            });
        })
    }

    const handleDelete = id => {
        setDataSource(dataSource.filter(item => item.id !== id));

        axios.delete(`/api/news/${id}`).then(res => {
            notification.info({
                message: `Notification`,
                description:
                    `Your news was deleted`,
                placement: 'bottomRight',
            });
        })
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete,
    }
}
