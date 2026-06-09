
const TABS = [
  { id: 'subjects', label: 'Subjects', icon: '🗺️' },
  { id: 'library',  label: 'Library',  icon: '📚' },
  { id: 'shop',     label: 'Shop',     icon: '🛒' },
  { id: 'profile',  label: 'Profile',  icon: '👤' },
]

export default function BottomNav({ activeView, onSubjects, onLibrary, onShop, onProfile }) {
  const actions = { subjects: onSubjects, library: onLibrary, shop: onShop, profile: onProfile }
  const activeTab = ['profile', 'library', 'shop'].includes(activeView) ? activeView : 'subjects'

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 'calc(58px + env(safe-area-inset-bottom))',
      paddingBottom: 'env(safe-area-inset-bottom)',
      background: 'var(--bg-mid)',
      borderTop: '1px solid var(--border-strong)',
      display: 'flex', alignItems: 'center',
      zIndex: 200,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }}>
      {/* Tabs — fill full width so they're evenly centered */}
      {TABS.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={actions[tab.id]}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '0.2rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: isActive ? 'var(--blue)' : 'var(--text-muted)',
              transition: 'color 0.15s',
              padding: '0.4rem 0',
              position: 'relative',
              minHeight: 48,
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute', top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: 24, height: 2,
                background: 'var(--blue)',
                borderRadius: '0 0 2px 2px',
                boxShadow: '0 0 8px var(--blue)',
              }} />
            )}
            <span style={{
              fontSize: '0.95rem', lineHeight: 1,
              fontFamily: 'var(--font-mono)',
              color: isActive ? 'var(--blue)' : 'var(--text-muted)',
            }}>
              {tab.icon}
            </span>
            <span style={{
              fontSize: '0.5rem', letterSpacing: '1.5px',
              fontFamily: 'var(--font-mono)',
              fontWeight: isActive ? 'bold' : 'normal',
            }}>
              {tab.label.toUpperCase()}
            </span>
          </button>
        )
      })}

    </nav>
  )
}
