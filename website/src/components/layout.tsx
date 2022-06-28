import React from 'react';
import styles from './layout.module.css';

interface ILayout {
    children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
    return (
        <main className={styles.main}>{children}</main>
    );
}

export default Layout;
