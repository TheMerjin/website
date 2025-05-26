import { useState } from 'react';
import { supabase } from "../lib/supabase";

export default function PostEditor({ selectedPost, onSave }) {
  const [content, setContent] = useState(selectedPost?.content || '');
  const [title, setTitle] = useState(selectedPost?.title || '');

  const savePost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .upsert({ id: selectedPost?.id, title, content });
    if (!error) onSave();
  };

  return (
    <div className="flex flex-col w-full p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold mb-4 outline-none border-b pb-1"
        placeholder="Post title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow p-2 border rounded resize-none h-[60vh] font-mono bg-white shadow"
        placeholder="Write your thoughts here..."
      />
      <button
        onClick={savePost}
        className="mt-4 self-start bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
      >
        Save
      </button>
    </div>
  );
}