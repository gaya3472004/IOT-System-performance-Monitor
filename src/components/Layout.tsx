import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, BarChart3, Home, Users, PieChart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">IoT Monitor</h1>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Home className="h-5 w-5" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/visualizations"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <BarChart3 className="h-5 w-5" />
                Visualizations
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/predictions"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Activity className="h-5 w-5" />
                Predictions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/export"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <Users className="h-5 w-5" />
                Export
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <PieChart className="h-5 w-5" />
                Analytics
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}