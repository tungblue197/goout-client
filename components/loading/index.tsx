import React from 'react'
import ReactLoading from 'react-loading';
const Loading = () => {
    return (
        <div className="loading-overlay">
            <ReactLoading type="spin" color={"#ccc"} className="prin" />
        </div>
    )
}

export default Loading
