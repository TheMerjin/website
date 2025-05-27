import { useState, useRef } from 'react';
import { supabase } from "../lib/supabase";

export default function PostEditor({ selectedPost, onSave }) {
  const [content, setContent] = useState(selectedPost?.content || '');
  const [title, setTitle] = useState(selectedPost?.title || '');
  const fileInputRef = useRef(null);

  const savePost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .upsert({ id: selectedPost?.id, title, content });

    if (!error) onSave?.();
  };

  const importGoogleDoc = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    setContent((prev) => `${prev}\n\n${text}`);
  };

  const createNewPost = () => {
    setTitle('');
    setContent('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 font-sans">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={createNewPost}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm shadow-sm"
          >
            New Post
          </button>
          <button
            onClick={importGoogleDoc}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm shadow-sm"
          >
            Import Google Doc
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        <button
          onClick={savePost}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm"
        >
          Save
        </button>
      </div>

      {/* Title input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-3xl font-bold mb-3 border-none outline-none bg-transparent w-full"
        placeholder="Post title..."
      />

      {/* Content textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border-none outline-none resize-none h-[60vh] font-mono bg-transparent shadow p-4 rounded text-base leading-relaxed"
        placeholder="Write your thoughts here..."
      />
    </div>
  );
}