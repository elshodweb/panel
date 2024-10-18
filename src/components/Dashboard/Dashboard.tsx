import React, { FC } from 'react';
import styles from './Dashboard.module.scss';

type DashboardProps = {
  selected: string;
};

const Dashboard: FC<DashboardProps> = ({ selected }) => {
  const renderContent = () => {
    switch (selected) {
      case 'home':
        return <div>Welcome to the Home Page!</div>;
      case 'profile':
        return <div>This is your Profile Page.</div>;
      case 'settings':
        return <div>Here you can adjust your Settings.</div>;
      default:
        return <div>Select an option from the menu.</div>;
    }
  };

  return <div className={styles.dashboard}>{renderContent()}</div>;
};

export default Dashboard;
