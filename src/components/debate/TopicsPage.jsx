import React, { useState, useEffect } from 'react';

const TopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [search, setSearch] = useState('');

  // Fetch topics
  const fetchTopics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: search
      });

      const response = await fetch(`/api/topics?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }

      const data = await response.json();
      setTopics(data.topics);
      setError(null);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Loading topics...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-medium text-gray-900 mb-3">Debate Topics</h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Structured argumentation and evidence-based discussion
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 font-medium"
            >
              Create Topic
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search topics..."
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-lg"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Topics List */}
        {topics.length === 0 ? (
          <div className="border border-gray-200 p-16 text-center">
            <div className="text-gray-500 text-xl mb-6">
              {search ? 'No topics found matching your search' : 'No topics have been created yet'}
            </div>
            {!search && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-8 py-4 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 font-medium text-lg"
              >
                Create the First Topic
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {topics.map((topic) => (
              <div key={topic.id} className="border border-gray-200 p-8 hover:border-gray-300 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-medium text-gray-900 mb-3">
                      {topic.title}
                    </h3>
                    {topic.description && (
                      <p className="text-gray-600 text-lg mb-4 leading-relaxed">{topic.description}</p>
                    )}
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>{topic.nodes?.[0]?.count || 0} arguments</span>
                      <span>•</span>
                      <span>Created {formatDate(topic.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <a
                    href={`/debate/topic/${topic.id}`}
                    className="px-6 py-3 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 font-medium"
                  >
                    View Debate
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Topic Modal */}
      {showCreateForm && (
        <CreateTopicModal
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchTopics();
          }}
        />
      )}
    </div>
  );
};

// Create Topic Modal Component
const CreateTopicModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create topic');
      }

      onSuccess?.();
    } catch (err) {
      console.error('Error creating topic:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-medium mb-6">Create New Topic</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-lg"
              placeholder="Enter topic title..."
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-lg"
              placeholder="Describe the topic..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="px-6 py-3 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating...' : 'Create Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicsPage;