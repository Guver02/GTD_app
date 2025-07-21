import React, { useState } from 'react';
import * as style from './MainPanel.module.css';
import { CreateTask } from '../task_components/CreateTask';
import { CreateProject } from '../projects_components/CreateProject';
import { useLanguage } from '../custom_hooks/useLanguage';

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
  const { translation } = useLanguage();

  const tabLabels = {
    Task: translation.createTask || 'Task',
    Project: translation.createProject || 'Project',
  };

  return (
    <div className={container}>
      <div className={tabBar}>
        {Object.keys(tabComponents).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            className={`${tabButton} ${activeTab === tabKey ? activeTabButton : ''}`}
          >
            {tabLabels[tabKey]}
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
