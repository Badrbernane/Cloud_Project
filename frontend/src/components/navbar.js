export default function Navbar({ onProfileClick }) {
  const username = localStorage.getItem('username') || 'User';

  return (
    <div className="flex items-center justify-between p-4 bg-transparent rounded-md mb-4">
      <input
        type="text"
        placeholder="Search"
        className="flex-1 rounded-full px-4 py-2 outline-none"
      />
      <div className="flex items-center space-x-4 ml-4">
        <button className="p-2 bg-white rounded-full hover:bg-gray-200">🔔</button>
        <button className="p-2 bg-white rounded-full hover:bg-gray-200">💬</button>
        <div className="flex items-center gap-2">
          <button 
            onClick={onProfileClick}
            className="text-sm text-gray-300 hover:text-white transition"
          >
            {username}
          </button>
          <button 
            onClick={onProfileClick}
            className="hover:ring-2 ring-blue-500 rounded-full transition"
          >
            <img
              src="/images/1758979867038.png"
              alt="profile"
              className="rounded-full w-10 h-10 cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
