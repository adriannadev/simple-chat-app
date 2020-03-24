import React, { Component } from "react";
import { Form, Icon, Input, Button, Row, Col } from "antd";
import io from "socket.io-client";
import { connect } from "react-redux";
import moment from "moment";
import { getChat, afterSendMessage } from "../../../_actions/chat_action";
import ChatCard from "./Sections/ChatCard";
import Dropzone from "react-dropzone";
import Axios from "axios";

class ChatPage extends Component {
  state = {
    chatMessage: ""
  };

  componentDidMount() {
    let server = "http://cryptic-atoll-88606.herokuapp.com";
    this.props.dispatch(getChat());
    this.socket = io(server);

    this.socket.on("Output chat message", msgFromBackend => {
      this.props.dispatch(afterSendMessage(msgFromBackend));
    });
  }

  //scroll to see last msg automatically
  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  handleChange = e => {
    this.setState({
      chatMessage: e.target.value
    });
  }

  //   renderCards = () => {
  //     this.props.chat.chat &&
  //       this.props.chat.chat.map(item => <ChatCard key={item._id} {...item} />);
  //   };

  onDrop = files => {
    console.log(files);

    if (this.props.user.userData && !this.props.user.userData.isAuth) {
      return alert("Please Log in first");
    }

    let formData = new FormData;

    const config = {
      header: { "content-type": "multipart/form-data" }
    };

    formData.append("file", files[0]);

    Axios.post("api/chat/uploadfiles", formData, config).then(response => {
      console.log(response.data)
      if (response.data.success) {
        let chatMessage = response.data.url;
        let userId = this.props.user.userData._id;
        let userName = this.props.user.userData.name;
        let userImage = this.props.user.userData.image;
        let nowTime = moment();
        let type = "VideoOrImage";

        this.socket.emit("Input chat message", {
          chatMessage,
          userId,
          userName,
          userImage,
          nowTime,
          type
        });
      }
    });
  };

  submitMessage = e => {
    e.preventDefault();
    if (this.props.user.userData && !this.props.user.userData.isAuth) {
      return alert("Please log in first");
    }


    let chatMessage = this.state.chatMessage;
    let userId = this.props.user.userData._id;
    let userName = this.props.user.userData.name;
    let userImage = this.props.user.userData.image;
    let currentTime = moment();
    let type = "Text";

    //using socket io for real-time
    this.socket.emit("Input chat message", {
      chatMessage,
      userId,
      userName,
      userImage,
      currentTime,
      type
    });
    this.setState({ chatMessage: "" });
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <p style={{ fontSize: "2rem", textAlign: "center" }}>
            {" "}
            Real Time Chat
          </p>
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div
            className="infinite-container"
            style={{ height: "500px", overflowY: "scroll" }}
          >
            {this.props.chat &&
              this.props.chat.chat &&
              this.props.chat.chat.map(item => (
                <ChatCard key={item._id} {...item} />
              ))}
            <div
              ref={el => {
                this.messagesEnd = el;
              }}
              style={{ float: "left", clear: "both" }}
            />
          </div>

          <Row>
            <Form layout="inline" onSubmit={this.submitMessage}>
              <Col span={18}>
                <Input
                  id="message"
                  prefix={
                    <Icon type="message" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Lets start chatting"
                  type="text"
                  value={this.state.chatMessage}
                  onChange={this.handleChange}
                />
              </Col>
              <Col span={2}>
                <Dropzone onDrop={this.onDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Button>
                          <Icon type="upload" />
                        </Button>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </Col>
              <Col span={4}>
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  htmlType="submit"
                  onClick={this.submitMessage}
                >
                  Send <Icon type="enter" />
                </Button>
              </Col>
            </Form>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.user,
    chat: state.chat
  };
};
export default connect(mapStateToProps)(ChatPage);
