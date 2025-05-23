import React, { useState } from 'react';
import * as style from './MainPanel.module.css';
import { CreateTask } from '../task_components/CreateTask';
import { CreateProject } from '../projects_components/CreateProject';

const {
  container,
  tabBar,
  tabButton,
  activeTabButton,
  contentBox,
} = style;

const tabComponents = {
  Task: CreateTask,
  Project: CreateProject,
};

function MainPanel() {
  const [activeTab, setActiveTab] = useState('Task');
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className={container}>
      <div className={tabBar}>
        {Object.keys(tabComponents).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            className={`${tabButton} ${activeTab === tabKey ? activeTabButton : ''}`}
          >
            {tabKey}
          </button>
        ))}
      </div>
      <div className={contentBox}>
        <ActiveComponent />
      </div>
    </div>
  );
}

export { MainPanel };
//.charAt(0).toUpperCase() + tabKey.slice(1)
