export default function LiveChat() {
  return (
    <div className="bg-red-800 rounded-md p-4 text-white">
      <h3 className="font-bold mb-2">Live Chat</h3>
      {["BigDaddy", "NoobPlayer69", "Queen_444"].map(user => (
        <div key={user} className="flex justify-between mb-1">
          <span>{user}</span>
          <span className="text-xs">2h ago</span>
        </div>
      ))}
    </div>
  )
}
