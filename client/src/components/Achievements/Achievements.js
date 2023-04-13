import React from 'react';
import AchievementCard from './AchievementCard/AchievementCard';


const Achievements = () => {
  const achievements = [
    {
      title: 'First Achievement',
      description: 'You have unlocked your first achievement!',
      unlocked: true,
    },
    {
      title: 'Second Achievement',
      description: 'You have unlocked your second achievement!',
      unlocked: true,
    },
    {
      title: 'Third Achievement',
      description: 'You have unlocked your third achievement!',
      unlocked: false,
    },
  ];

  return (
    <div>
      <h2>Achievements</h2>
      {achievements.map((achievement) => (
        <AchievementCard
          key={achievement.title}
          title={achievement.title}
          description={achievement.description}
          unlocked={achievement.unlocked}
        />
      ))}
    </div>
  );
};

export default Achievements;
