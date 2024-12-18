import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import './tab.css';

interface TabData {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface InvoiceTicketProps {
  tabs: TabData[];
}

const EnhancedTabs: React.FC<InvoiceTicketProps> = ({ tabs }) => {
  const [value, setValue] = React.useState(tabs[0].value);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const renderTabContent = () => {
    const currentTab = tabs.find(tab => tab.value === value);
    return currentTab ? currentTab.content : null;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="secondary tabs example"
        TabIndicatorProps={{
          children: <span className="MuiTabs-indicatorSpan" />
        }}
        sx={{
          '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              bottom: 0,
              height: '4px',
              width: '56px',
              borderRadius: '15px',
              backgroundColor: '#22C55D',
              transform: 'translateX(0px)',
            }
          },
          '& .MuiTab-root': {
            color: '#919EAB',
            fontSize: '12px',
            textTransform: 'capitalize',
            fontWeight: 500,
          },
          '& .Mui-selected': {
            color: '#22C55D !important',
            fontSize: '14px',
          },
        }}
      >
        {tabs.map(tab => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      <Box sx={{ p: 3 }}>
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default EnhancedTabs;