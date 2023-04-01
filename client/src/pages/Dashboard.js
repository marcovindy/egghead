import React, { useContext } from "react";
import Card from 'react-bootstrap/Card';
import {Image} from 'react-bootstrap';
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import { AuthContext } from "../helpers/AuthContext";

const Dashboard = () => {
  const IS_PROD = process.env.NODE_ENV === "development";
  const URL = IS_PROD ? "http://localhost:5000" : "https://testing-egg.herokuapp.com";

  const [listOfQuizzes, setListOfQuizzes] = useState([]);
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  let history = useHistory();


  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
      axios
        .get(`${URL}/posts`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.PostId;
            })
          );
        });


      axios
        .get(`${URL}/quizzes`, {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          console.log('Server response:', response);
          setListOfQuizzes(response.data.quizzes);
        })
        .catch((error) => {
          console.log('Error:', error);
        });

    }
  }, []);

  const likeAPost = (postId) => {
    axios
      .post(
        `${URL}/likes`,
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        if (likedPosts.includes(postId)) {
          setLikedPosts(
            likedPosts.filter((id) => {
              return id != postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      });
  };

  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className="post">
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{value.title} </Card.Title>
                <div
                  className="body"
                  onClick={() => {
                    history.push(`/post/${value.id}`);
                  }}
                >
                  {value.postText}
                </div>
                <div className="footer">
                  <div className="username">
                    <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
                  </div>
                  <div className="buttons">
                    <ThumbUpAltIcon
                      onClick={() => {
                        likeAPost(value.id);
                      }}
                      className={
                        likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                      }
                    />

                    <label> {value.Likes.length}</label>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        );
      })}
      <h2>List of Quizzes</h2>
      <div>
        {listOfQuizzes.map((value, key) => {
          return (
            <div key={key} className="post">
              <Card style={{ width: '18rem' }}>
                <Card.Body>
                  <Card.Title>{value.title} </Card.Title>
                  <div
                    className="body"
                    onClick={() => {
                      history.push(`/post/${value.id}`);
                    }}
                  >
                    {value.description}
                  </div>
                  <div className="footer">
                    <div className="username">
                      <Link to={`/profile/${value.UserId}`}> {value.User.username} </Link>
                    </div>
                    <ul>
                      {value.Categories.map((category) => (
                        <li key={category.id}>{category.name}</li>
                      ))}
                    </ul>

                  </div>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>

      <div class="card" style="max-width: 22rem;">

        <div class="view overlay">
          <Image class="card-img-top" src="https://mdbootstrap.com/img/Photos/Others/food.webp" alt="Card image cap"/>
            <a>
              <div class="mask rgba-white-slight waves-effect waves-light"></div>
            </a>
        </div>

        <a class="btn-floating btn-action ml-auto mr-4 mdb-color lighten-3 waves-effect waves-light"><i class="fas fa-chevron-right pl-1"></i></a>

        <div class="card-body">

          <h4 class="card-title">Card title</h4>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
              content.</p>

        </div>

        <div class="rounded-bottom mdb-color lighten-3 text-center pt-3">
          <ul class="list-unstyled list-inline font-small">
            <li class="list-inline-item pr-2 white-text"><i class="far fa-clock pr-1"></i>05/10/2015</li>
            <li class="list-inline-item pr-2"><a href="#" class="white-text"><i class="far fa-comments pr-1"></i>12</a></li>
            <li class="list-inline-item pr-2"><a href="#" class="white-text"><i class="fab fa-facebook-f pr-1">
            </i>21</a></li>
            <li class="list-inline-item"><a href="#" class="white-text"><i class="fab fa-twitter pr-1"> </i>5</a></li>
          </ul>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
