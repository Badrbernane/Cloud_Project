export default function Post({ user, image, content }) {
  return (
    <div className="bg-red-800 rounded-md p-4 mb-4 text-white">
      <div className="font-bold">{user}</div>
      <p className="my-2">{content}</p>
      {image && <img src={image} alt="post" className="rounded-md" />}
      <div className="flex justify-between mt-2 text-sm">
        <button>👍 Like</button>
        <button>💬 Comment</button>
      </div>
    </div>
  )
}
