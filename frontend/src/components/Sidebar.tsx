interface User {
  _id: string;
  username: string;
  email: string;
}

type SidebarProps = {
    onLogout:() => void;
    user: User | null;
};

export default function Sidebar({onLogout, user}: SidebarProps) {
    return (
        <div className="Sidebar" style={{ width: '130px', background: '#f0f0f0', padding: '1rem', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
            <h2>Menu</h2>
            <p>Welcome, <strong>{user?.username || 'User'}</strong></p>
            <div style={{ marginTop: 'auto' }}>
                <button onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
}