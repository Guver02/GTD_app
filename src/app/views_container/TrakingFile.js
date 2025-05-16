import React, { useState } from 'react';
import * as styles from './TrakingFile.module.css';

const mockData = {
  "2025-05-16": [
    { time: '09:00', title: 'Morning Standup', description: 'Daily sync with team' },
    { time: '11:00', title: 'Client Meeting', description: 'Project discussion with client' },
    { time: '14:00', title: 'Code Review', description: 'Review pull requests' },
    { time: '16:00', title: 'Design Handoff', description: 'Handoff from design team' }
  ],
  "2025-05-17": [
    { time: '10:00', title: 'Planning Session', description: 'Sprint planning' },
    { time: '13:00', title: 'Lunch with Lead', description: 'Team lead sync over lunch' }
  ]
};

const {
  timelineContainer,
  header,
  timeline,
} = styles;

function TrakingFile() {
  const [currentDate, setCurrentDate] = useState('2025-05-16');

  const goToPreviousDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next.toISOString().split('T')[0]);
  };

  const events = mockData[currentDate] || [];

  return (
    <div className={timelineContainer}>
      <div className={header}>
        <button onClick={goToPreviousDay}>←</button>
        <h2>{currentDate}</h2>
        <button onClick={goToNextDay}>→</button>
      </div>
      <div className={timeline}>
        {events.map((event, idx) => (
          <TimelineEvent
            key={idx}
            time={event.time}
            title={event.title}
            description={event.description}
            position={idx % 2 === 0 ? 'left' : 'right'}
          />
        ))}
      </div>
    </div>
  );
}

const {
  eventItem,
  left,
  right,
  time: timeClass,
  content,
} = styles;

function TimelineEvent({ time, title, description, position }) {
  return (
    <div className={`${eventItem} ${styles[position]}`}>
      <div className={timeClass}>{time}</div>
      <div className={content}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}


export { TrakingFile };
