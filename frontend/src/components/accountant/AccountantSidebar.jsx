import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const AccountantSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: 'fas fa-tachometer-alt',
      color: 'primary'
    },
    {
      title: 'Payment Management',
      items: [
        {
          title: 'Payment Records',
          path: '/payment-records',
          icon: 'fas fa-credit-card',
          description: 'Manage payment records'
        },
        {
          title: 'Transaction History',
          path: '/transaction-history',
          icon: 'fas fa-history',
          description: 'View transaction history'
        }
      ]
    },
    {
      title: 'Report Management',
      items: [
        {
          title: 'Tuition Reports',
          path: '/tuition-reports',
          icon: 'fas fa-chart-bar',
          description: 'Generate tuition reports'
        },
        {
          title: 'Meal Fee Reports',
          path: '/meal-fee-reports',
          icon: 'fas fa-utensils',
          description: 'Generate meal fee reports'
        }
      ]
    },
    {
      title: 'Profile Management',
      items: [
        {
          title: 'Profile',
          path: '/profile',
          icon: 'fas fa-user',
          description: 'View and edit profile'
        }
      ]
    }
  ];

  return (
    <div className="sidebar bg-dark text-white" style={{ 
      minHeight: '100vh', 
      width: '280px',
      position: 'fixed',
      top: '0',
      left: '0',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div className="p-3 border-bottom border-secondary">
        <h5 className="mb-0">
         
          Accountant Panel
        </h5>
      </div>
      
      <Nav className="flex-column p-0">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.path ? (
              <Nav.Link
                as={Link}
                to={item.path}
                className={`text-white px-3 py-3 border-0 d-flex align-items-center ${
                  isActive(item.path) ? 'bg-primary' : ''
                } sidebar-link`}
                style={{ textDecoration: 'none' }}
              >
                <i className={`${item.icon} me-3`}></i>
                <span>{item.title}</span>
              </Nav.Link>
            ) : (
              <>
                <div className="px-3 py-2 text-muted small fw-bold mt-3">
                  {item.title.toUpperCase()}
                </div>
                {item.items.map((subItem, subIndex) => (
                  <Nav.Link
                    key={subIndex}
                    as={Link}
                    to={subItem.path}
                    className={`text-white px-4 py-2 border-0 d-flex align-items-center ${
                      isActive(subItem.path) ? 'bg-primary' : ''
                    } sidebar-link`}
                    style={{ textDecoration: 'none' }}
                  >
                    <i className={`${subItem.icon} me-3`} style={{ width: '16px' }}></i>
                    <div>
                      <div style={{fontWeight: "bold"}}>{subItem.title}</div>
                      <small className="text-white">{subItem.description}</small>
                    </div>
                  </Nav.Link>
                ))}
              </>
            )}
          </div>
        ))}
      </Nav>

      <style jsx>{`
        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
        }
        .sidebar-link.active {
          background-color: var(--bs-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default AccountantSidebar;