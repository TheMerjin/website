import React, { useState, useEffect } from 'react';
import DebateGraph from './DebateGraph';

const TopicPage = ({ topic: initialTopic, nodes: initialNodes, edges: initialEdges }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [nodes, setNodes] = useState(initialNodes || []);
  const [edges, setEdges] = useState(initialEdges || []);
  const [loading, setLoading] = useState(!initialTopic);
  const [error, setError] = useState(null);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [showEdgeForm, setShowEdgeForm] = useState(false);
  const [activeTab, setActiveTab] = useState('graph');

  // If no initial topic data, try to fetch it
  useEffect(() => {
    if (!initialTopic) {
      const topicId = window.location.pathname.split('/').pop();
      fetchTopicData(topicId);
    }
  }, [initialTopic]);

  const fetchTopicData = async (topicId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/topics/${topicId}`);
      if (response.ok) {
        const data = await response.json();
        setTopic(data);
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      } else {
        setError('Topic not found');
      }
    } catch (err) {
      setError('Failed to load topic');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNode = async (nodeData) => {
    try {
      const response = await fetch('/api/nodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...nodeData,
          topic_id: topic.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create node');
      }

      const newNode = await response.json();
      setNodes(prev => [...prev, newNode]);
      setShowNodeForm(false);
    } catch (err) {
      console.error('Error creating node:', err);
    }
  };

  const handleCreateEdge = async (edgeData) => {
    try {
      const response = await fetch('/api/edges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(edgeData)
      });

      if (!response.ok) {
        throw new Error('Failed to create edge');
      }

      const newEdge = await response.json();
      setEdges(prev => [...prev, newEdge]);
      setShowEdgeForm(false);
    } catch (err) {
      console.error('Error creating edge:', err);
    }
  };

  const getNodeColor = (type, weight) => {
    const w = weight || 0;
    if (type === 'claim') {
      if (w > 0.7) return 'border-green-400 bg-green-50';
      if (w > 0.4) return 'border-yellow-400 bg-yellow-50';
      return 'border-red-400 bg-red-50';
    } else {
      return 'border-blue-400 bg-blue-50';
    }
  };

  const getEdgeColor = (type) => {
    const colors = {
      support: 'border-green-400',
      oppose: 'border-red-400',
      follows: 'border-blue-400',
      challenges: 'border-yellow-400'
    };
    return colors[type] || 'border-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Loading debate...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.href = '/debate'}
            className="px-6 py-3 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 font-medium"
          >
            Back to Topics
          </button>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">Loading topic...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  const claims = nodes.filter(n => n.type === 'claim');
  const connections = nodes.filter(n => n.type === 'connection');

  // Debug logging
  console.log('TopicPage data:', { topic, nodes, edges, claims, connections });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-medium text-gray-900 mb-3">{topic.title}</h1>
              {topic.description && (
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">{topic.description}</p>
              )}
              <div className="flex items-center text-sm text-gray-500 space-x-6">
                <span>{claims.length} claims</span>
                <span>{connections.length} connections</span>
                <span>{edges.length} relationships</span>
              </div>
            </div>
            <div className="ml-8 flex space-x-4">
              <button
                onClick={() => setShowNodeForm(true)}
                className="px-6 py-3 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 font-medium"
              >
                Add Argument
              </button>
              <button
                onClick={() => setShowEdgeForm(true)}
                className="px-6 py-3 bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 font-medium"
              >
                Add Connection
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {['graph', 'claims', 'connections'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-lg capitalize ${
                  activeTab === tab
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'graph' && (
          <div className="space-y-8">
            {/* Interactive Graph Visualization */}
            <DebateGraph 
              nodes={nodes} 
              edges={edges} 
              width={800} 
              height={600} 
            />

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{nodes.length}</div>
                <div className="text-sm text-gray-600">Total Arguments</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{claims.length}</div>
                <div className="text-sm text-gray-600">Claims</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{connections.length}</div>
                <div className="text-sm text-gray-600">Connections</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{edges.length}</div>
                <div className="text-sm text-gray-600">Relationships</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowNodeForm(true)}
                className="px-6 py-3 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 font-medium"
              >
                Add Argument
              </button>
              <button
                onClick={() => setShowEdgeForm(true)}
                className="px-6 py-3 bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 font-medium"
              >
                Add Connection
              </button>
            </div>
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="space-y-6">
            {claims.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-500 text-xl mb-6">No claims have been added yet</div>
                <button
                  onClick={() => setShowNodeForm(true)}
                  className="px-8 py-4 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 font-medium text-lg"
                >
                  Add First Claim
                </button>
              </div>
            ) : (
              claims.map((claim) => (
                <div
                  key={claim.id}
                  className={`border-2 p-8 ${getNodeColor(claim.type, claim.weight)}`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-medium text-gray-900 mb-4">{claim.content}</h3>
                      <div className="text-lg text-gray-600">
                        Weight: {claim.weight.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Claim</span>
                    </div>
                  </div>
                  
                  {claim.evidence && claim.evidence.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-700 mb-4">Evidence</h4>
                      <div className="space-y-3">
                        {claim.evidence.map((ev) => (
                          <div key={ev.id} className="text-gray-600 bg-white p-4 border border-gray-200">
                            {ev.description}
                            <span className="ml-4 text-sm text-gray-500">
                              (Credibility: {ev.credibility.toFixed(2)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="space-y-6">
            {connections.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-500 text-xl mb-6">No connections have been added yet</div>
                <button
                  onClick={() => setShowEdgeForm(true)}
                  className="px-8 py-4 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 font-medium text-lg"
                >
                  Add First Connection
                </button>
              </div>
            ) : (
              connections.map((connection) => (
                <div
                  key={connection.id}
                  className="border border-gray-200 p-8"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-medium text-gray-900 mb-4">{connection.content}</h3>
                      <div className="text-lg text-gray-600">
                        Weight: {connection.weight.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Connection</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Node Form Modal */}
      {showNodeForm && (
        <NodeFormModal
          onClose={() => setShowNodeForm(false)}
          onSuccess={handleCreateNode}
        />
      )}

      {/* Edge Form Modal */}
      {showEdgeForm && (
        <EdgeFormModal
          nodes={nodes}
          onClose={() => setShowEdgeForm(false)}
          onSuccess={handleCreateEdge}
        />
      )}
    </div>
  );
};

// Node Form Modal Component
const NodeFormModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'claim',
    content: '',
    weight: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSuccess(formData);
    } catch (err) {
      console.error('Error creating node:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-medium mb-6">Add Argument</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-lg"
            >
              <option value="claim">Claim</option>
              <option value="connection">Connection</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-lg"
              placeholder="Enter argument content..."
            />
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              Weight
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              min="0"
              max="1"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-lg"
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
              disabled={loading || !formData.content.trim()}
              className="px-6 py-3 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating...' : 'Create Argument'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edge Form Modal Component
const EdgeFormModal = ({ nodes, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    parent_node: '',
    child_node: '',
    type: 'support',
    weight: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSuccess(formData);
    } catch (err) {
      console.error('Error creating edge:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-medium mb-6">Add Connection</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="parent_node" className="block text-sm font-medium text-gray-700 mb-2">
              From Argument *
            </label>
            <select
              id="parent_node"
              name="parent_node"
              value={formData.parent_node}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-lg"
            >
              <option value="">Select an argument...</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>
                  {node.content.substring(0, 50)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Relationship Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-lg"
            >
              <option value="support">Support</option>
              <option value="oppose">Oppose</option>
              <option value="follows">Follows</option>
              <option value="challenges">Challenges</option>
            </select>
          </div>

          <div>
            <label htmlFor="child_node" className="block text-sm font-medium text-gray-700 mb-2">
              To Argument *
            </label>
            <select
              id="child_node"
              name="child_node"
              value={formData.child_node}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-lg"
            >
              <option value="">Select an argument...</option>
              {nodes
                .filter(node => node.id !== formData.parent_node)
                .map(node => (
                  <option key={node.id} value={node.id}>
                    {node.content.substring(0, 50)}...
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              Weight
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 text-lg"
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
              disabled={loading || !formData.parent_node || !formData.child_node}
              className="px-6 py-3 bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating...' : 'Create Connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TopicPage;