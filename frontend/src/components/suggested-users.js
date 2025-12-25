export default function SuggestedUsers() {
  return (
    <div className="bg-red-800 rounded-md p-4 text-white mb-4">
      <h3 className="font-bold mb-2">Suggested for you</h3>
      {["Faraz Tariq", "Tina Tzoo", "MKBHD"].map(user => (
        <div key={user} className="flex justify-between mb-2">
          <span>{user}</span>
          <button className="bg-purple-600 px-2 rounded">Follow</button>
        </div>
      ))}
    </div>
  )
}
