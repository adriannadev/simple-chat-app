import React from 'react'
import { Icon } from 'antd';
function LandingPage() {
    return (
        <div className="app" style={{ fontSize: '2rem' }}>
            <span>Enter the chatroom!</span>
            <span><a href="/chat"><Icon type="right-square-o" /></a></span>
        </div>
    )
}

export default LandingPage
