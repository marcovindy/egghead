import React, { useState, useEffect } from 'react';
import AchievementCard from './AchievementCard/AchievementCard';
import { Trophy } from 'react-bootstrap-icons';
import axios from 'axios';
import './Achievements.css';

const Achievements = ({ preview, userId }) => {
  const [achievements, setAchievements] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const IS_PROD = process.env.NODE_ENV === "production";
  const API_URL = IS_PROD ? "https://testing-egg.herokuapp.com" : "http://localhost:5000";

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        if (userId) {
          const response = await axios.get(`${API_URL}/achievements`, {
            params: { userId },
          });
          setAchievements(response.data);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, [userId]);
  return (
    <div>

      {preview ? (
        <div className='achievement'>
          {achievements.map((achievement, index) => (
            <div className="achievement-preview"
              key={achievement.title}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
            >
              <Trophy size={35} />
              {hoveredIndex === index && (
                <div className="achievement-preview-tooltip">
                  <p className='small'>{achievement.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          <h2>Achievements</h2>
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.title}
              title={achievement.title}
              description={achievement.description}
              unlocked={achievement.unlocked}
            />

          ))}
        </>
      )}
    </div>

  );
};

export default Achievements;
