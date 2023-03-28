import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";

import imgUrl from "../../assets/images/egg2.png";

function Profile() {
  const IS_PROD = process.env.NODE_ENV === "development";
  const URL1 = IS_PROD ? "http://localhost:5000/auth/basicinfo/" : "https://testing-egg.herokuapp.com/auth/basicinfo/";
  const URL2 = IS_PROD ? "http://localhost:5000/posts/byuserId/" : "https://testing-egg.herokuapp.com/posts/byuserId/";

  let { id } = useParams();
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [listOfPosts, setListOfPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`${URL1}${id}`).then((response) => {
      setUsername(response.data.username);
    });

    axios.get(`${URL2}${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, []);

  return (
    <Container>
      <div className="profilePageContainer">
        <Row className="justify-content-center">

          <Col>
            <div className="avatarBox">
              <Image width='300px' src={imgUrl}></Image>
            </div>
          </Col>
          <Col>

            <div className="infoBox">
              {" "}
              <h1> Username: {username} </h1>
              {authState.username === username && (
                <button
                  onClick={() => {
                    history.push("/changepassword");
                  }}
                >
                  {" "}
                  Change My Password
                </button>
              )}
            </div>
          </Col> </Row>
        <Row className="justify-content-center">
          <div className="listOfPosts">
            {listOfPosts.map((value, key) => {
              return (
                <div key={key} className="post">
                  <div className="title"> {value.title} </div>
                  <div
                    className="body"
                    onClick={() => {
                      history.push(`/post/${value.id}`);
                    }}
                  >
                    {value.postText}
                  </div>
                  <div className="footer">
                    <div className="username">{value.username}</div>
                    <div className="buttons">
                      <label> {value.Likes.length}</label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Row>
      </div>

    </Container >
  );
}

export default Profile;
