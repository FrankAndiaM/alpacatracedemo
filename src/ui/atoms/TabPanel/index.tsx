import React from 'react';

type TabPanelProps = {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
};

const TabPanel: React.FC<TabPanelProps> = (props: TabPanelProps) => {
  const { children, value, index, ...other }: TabPanelProps = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

export default React.memo(TabPanel);
