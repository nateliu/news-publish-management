import { Button } from 'antd'
import React from 'react'
import axios from 'axios'

export default function Home() {
    const jsonServerOperation = () => {
        // get
        axios.get("/api/rights?_embed=children").then(res=>{
            console.log(res.data);
        })
    }

    return (
        <div>
            <Button type='primary' onClick={jsonServerOperation} >Click me</Button>
        </div>
    )
}
