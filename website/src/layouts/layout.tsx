import React from 'react';

interface ILayout {
    children: React.ReactNode;
}

const Layout: React.FC<ILayout> = ({ children }) => {
    return (
        <main className="p-0 mx-auto m-0">{children}</main>
    );
}

export default Layout;
