import { NavLink } from 'react-router-dom';

const tabs = [
  {
    to: '/',
    label: 'Search',
    icon: (active: boolean) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#E8A23D' : 'currentColor'}
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
  },
  {
    to: '/groups',
    label: 'Groups',
    icon: (active: boolean) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#E8A23D' : 'currentColor'}
        strokeWidth="2"
      >
        <circle cx="8" cy="8" r="3" />
        <circle cx="16" cy="8" r="3" />
        <circle cx="8" cy="16" r="3" />
        <circle cx="16" cy="16" r="3" />
      </svg>
    ),
  },
  {
    to: '/add',
    label: 'Add device',
    icon: (active: boolean) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={active ? '#E8A23D' : 'currentColor'}
        strokeWidth="2"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
  },
];

export function TabBar() {
  return (
    <nav className="tabbar-shell fixed bottom-0 z-20 bg-paper-raised border-t border-line flex safe-bottom-tabbar">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex-1 text-center pt-2.5 px-1 pb-1.5 text-[11px] min-h-11 ${
              isActive ? 'text-ink font-semibold' : 'text-ink-soft'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex justify-center mb-0.5">{tab.icon(isActive)}</div>
              {tab.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
