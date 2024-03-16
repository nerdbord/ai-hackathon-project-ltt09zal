import React, { ReactNode } from 'react';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.backgroundDesktop}>
      <div className={styles.container}>{children}</div>
    </div>
  );
};

export default Layout;
