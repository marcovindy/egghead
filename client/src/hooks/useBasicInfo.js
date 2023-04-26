import { useState, useEffect } from "react";
import axios from "axios";

const useBasicInfo = (username) => {
  const [basicInfo, setBasicInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const API_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://testing-egg.herokuapp.com";

  useEffect(() => {
    const fetchBasicInfo = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/auth/user/byusername/${username}`
        );
        setBasicInfo(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBasicInfo();
  }, [username, API_URL]);

  return { basicInfo, isLoading };
};

export default useBasicInfo;
