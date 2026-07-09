import type { JSX, ReactNode } from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
  type TabsProps as RACTabsProps,
} from 'react-aria-components';
import { tabs as tabsStyles } from '@var-ui/core';

type TabDefinition = {
  id: string;
  label: string;
  content: ReactNode;
};

export type TabsProps = Omit<RACTabsProps, 'children'> & {
  /** Tab definitions with id, label, and panel content. */
  tabs: TabDefinition[];
};

export function Tabs({ tabs, ...props }: TabsProps): JSX.Element {
  const t = tabsStyles();
  return (
    <AriaTabs {...props} className={t.root}>
      <TabList className={t.list}>
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} className={t.tab}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id} id={tab.id} className={t.panel}>
          {tab.content}
        </TabPanel>
      ))}
    </AriaTabs>
  );
}
