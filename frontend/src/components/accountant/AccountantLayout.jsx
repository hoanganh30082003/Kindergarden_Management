import React from 'react';
import Header from '../Header';
import AccountantSidebar from './AccountantSidebar';

const AccountantLayout = ({ children, title, subtitle }) => {
  return (
    <div className="d-flex">
      <AccountantSidebar />
      <div className="flex-grow-1" style={{ marginLeft: '280px' }}>
        <Header />
        <div className="p-4">
          {(title || subtitle) && (
            <div className="mb-4">
              {title && <h1 className="mb-1">{title}</h1>}
              {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccountantLayout;