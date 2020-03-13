import React, { Component } from 'react'
import { Form, Icon, Input, Button, Row, Col } from 'antd'
import io from "socket.io-client";
import { connect } from "react-redux"
import moment from 'moment';

class ChatPage extends Component {
    state = {
        chatMessage: ""
    }

    componentDidMount() {
        let server="http://localhost:5000";
        this.socket = io(server);
        this.socket.on("Output chat message", msgFromBackend => {
            console.log(msgFromBackend)
        })
    }

    handleChange = (e) => {
        this.setState({
            chatMessage: e.target.value
        })
    }
    submitMessage = (e) => {
        e.preventDefault();

        let chatMessage = this.state.chatMessage;
        let userId = this.props.user.userData._id;
        let userName = this.props.user.userData.name;
        let userImage = this.props.user.userData.image;
        let currentTime = moment();
        let type = "Image";

        //using socket io for real-time
        this.socket.emit("Input chat message", {
            chatMessage, 
            userId,
            userName,
            userImage,
            currentTime,
            type
        });
        this.setState({chatMessage: ""});
    }

    render() {
        return (
            <React.Fragment>
            <div>
                <p style={{fontSize:'2rem', textAlign: 'center'}}>Real Time Chat</p>
            </div>
            <div style={{maxWidth: '800px', margin: '0 auto'}}>
                <div className="infinite-container">
                    <div ref={el => {
                        this.messagesEnd = el;
                    }}
                    style={{ float: 'left', clear:'both'}}
                    />
                </div>
                <Row>
                    <Form layout="inline" onSubmit={this.submitMessage}>
                        <Col span={18}>
                            <Input
                            id="message"
                            prefix={<Icon type="message" style={{color:'rgba(0,0,0,.25)'}} />}
                            placeholder='Lets start chatting'
                            type='text'
                            value={this.state.chatMessage}
                            onChange={this.handleChange}
                            />
                        </Col>
                        <Col span={2}>

                        </Col>
                        <Col span={4}>
                            <Button type="primary" 
                            style={{width:'100%'}} 
                            htmlType='submit'
                            onClick={this.submitMessage}>
                                Send <Icon type="enter" />
                            </Button>
                        </Col>
                    </Form>
                </Row>
            </div>
            </React.Fragment>
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.user
    }
} 
export default connect(mapStateToProps)(ChatPage);