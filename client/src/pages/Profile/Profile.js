import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { useParams, useHistory, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../helpers/AuthContext";
import Achievements from "../../components/Achievements/Achievements";
import Badge from "../../components/Badge/Badge";
import t from "../../i18nProvider/translate";
import "./Profile.css";
import Dashboard from "../Dashboard";
import EditableTitle from "../../components/EditableTitle/EditableTitle";
import { toast } from "react-toastify";
import {
  getUserByUsername,
  getQuizzesByUserId,
  checkUserExists,
  changeUserName,
  updateUserDescription,
} from "../../services/api";

const img =
  "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg";

const initialUserState = {
  id: "",
  avatar: "default-avatar.png",
  username: "",
  email: "",
  experience: 0,
  level: 1,
};



function Profile() {
  const [error, setError] = useState(null);
  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD
    ? "https://testing-egg.herokuapp.com"
    : "http://localhost:5000";

  const [user, setUser] = useState(initialUserState);
  const { authState } = useContext(AuthContext);
  let { username } = useParams();
  let history = useHistory();
  const [id, setId] = useState();
  const [listOfQuizzes, setListOfQuizzes] = useState([]);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    const source = axios.CancelToken.source();
    getUserByUsername(username, source.token)
      .then((response) => {
        if (response.data) {
          setId(response.data.id);
          setUser(response.data);
          setError(null);
        } else {
          setError(`${t("This user doesnt exist")}: ${username}`);
          console.log("This user doesnt exist", username);
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
        } else {
          console.log("err", error.message);
          setError(`${t("Loading of user profile failed")}: ${error.message}`);
        }
      });
    return () => {
      source.cancel("Request canceled by cleanup");
    };
  }, [username]);

  const checkUserExistsWrapper = async (newName) => {
    try {
      const response = await checkUserExists(newName);
      return response.data;
    } catch (error) {
      console.error("Error checking user exists:", error);
    }
    return null;
  };

  useEffect(() => {
    const maxExperience = (100 * user.level) / 2;
    const experiencePercentage = (user.experience / maxExperience) * 100;
    setProgress(experiencePercentage);
  }, [user.experience, user.level]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    getQuizzesByUserId(id, source.token)
      .then((response) => {
        setListOfQuizzes(response.data.quizzes);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled by cleanup:", error.message);
        } else {
          throw error;
        }
      });
    return () => {
      source.cancel("Request canceled by cleanup");
    };
  }, [id]);

  if (error) {
    return (
      <div className="error-message">
        <h1>{error}</h1>
      </div>
    );
  }

  const validateName = (name) => {
    const namePattern = /^[A-Za-z0-9]{3,20}$/;
    return namePattern.test(name);
  };

  const logoutAndRedirect = () => {
    localStorage.removeItem("accessToken");
    history.push("/login");
    toast.success(t("logout-success"));
  };

  const handleNameSave = async (newTitle) => {
    const newName = newTitle.trim();
    if (validateName(newName)) {
      const userExists = await checkUserExistsWrapper(newName);
      if (!userExists) {
        changeUserName(newName, localStorage.getItem("accessToken"))
          .then((response) => {
            if (response.data.success) {
              toast.success(response.data.message);
              logoutAndRedirect();
            } else {
              toast.error(response.data.message);
            }
          })
          .catch((error) => {
            const ErrorMessage = t("Error changing name:");
            console.error(ErrorMessage, error);
          });
      } else {
        const ErrorMessage = t("Username already exists.");
        toast.error(ErrorMessage);
      }
    } else {
      const ErrorMessage = t(
        "Username must be between 3 and 20 characters and contain only letters and numbers"
      );
      toast.error(ErrorMessage);
    }
  };

  const handleDescriptionSave = async (newDescription) => {
    const description = newDescription.trim();

    updateUserDescription(id, description, localStorage.getItem("accessToken"))
      .then((response) => {
        if (response.success) {
          toast.success(response.message);
          setUser({ ...user, description });
        } else {
          toast.error(response.message);
        }
      })
      .catch((error) => {
        const ErrorMessage = t("Error updating description:");
        console.error(ErrorMessage, error);
      });
      

  };

  return (
    <Container>
      <div className="profile-page-container">
        <Row className="justify-content-center">
          <Col lg={6} md={12}>
            <div className="avatarBox">
              <Image
                src={
                  user.avatar &&
                  require(`../../assets/images/userAvatars/${user.avatar}`)
                }
                alt={user.avatar || "default-avatar"}
                width="200px"
              />

              <div className="d-flex p-3">
                <Badge level={user.level} />
                <ProgressBar now={progress} label={`${progress} %`} />
              </div>
            </div>
          </Col>
          <Col lg={6} md={12}>
            <div className="infoBox">
              {authState.username !== username ? (
                <>
                  <h2>
                    {t("Username")}: {username}
                  </h2>
                </>
              ) : (
                <>
                  <h2>
                    <EditableTitle
                      title={username}
                      onTitleSave={handleNameSave}
                    />
                  </h2>

                  <div className="mt-2">
                    <button
                      className="a-button"
                      onClick={() => {
                        history.push("/changepassword");
                      }}
                    >
                      {" "}
                      {t("Change Your Password")}
                    </button>
                  </div>
                </>
              )}
              <div className="mt-4">
                {authState.username !== username ? (
                  <p>
                    {t("Descirption")}: {user.description}
                  </p>
                ) : (
                  <p>
                    <EditableTitle
                      title={user.description || t("Description")}
                      onTitleSave={handleDescriptionSave}
                    />
                  </p>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {authState.username !== username ? (
          <>
            <h2>{t("Quizzes")}</h2>
          </>
        ) : (
          <>
            <h2>{t("My Quizzes")}</h2>
            <button
              className="a-button"
              onClick={() => {
                history.push("/createquiz");
              }}
            >
              {t("Add Quiz")}
            </button>
          </>
        )}
        <Dashboard userId={id ? id : undefined} />
        <Row>
          <Achievements preview={false} userId={id} />
        </Row>
      </div>
    </Container>
  );
}

export default Profile;
