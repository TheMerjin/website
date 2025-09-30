-- Simple Debate System Schema for Supabase
-- Based on the provided schema structure

-- Topics
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- Nodes (claims or connections)
CREATE TABLE nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  type text CHECK(type IN ('claim','connection')),
  content text NOT NULL,
  created_by uuid REFERENCES auth.users(id), -- nullable for now
  public boolean DEFAULT TRUE,
  weight numeric DEFAULT 0, -- optional overall weight
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- Edges between nodes (auto-generated from connection nodes)
CREATE TABLE edges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_node uuid REFERENCES nodes(id) ON DELETE CASCADE,
  child_node uuid REFERENCES nodes(id) ON DELETE CASCADE,
  type text CHECK(type IN ('support','oppose','follows','challenges')),
  weight numeric DEFAULT 1, -- optional weighting
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- Evidence items
CREATE TABLE evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id uuid REFERENCES nodes(id) ON DELETE CASCADE,
  description text NOT NULL,
  credibility numeric DEFAULT 0.5,
  public boolean DEFAULT TRUE,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- User weights / beliefs (private degrees of belief)
CREATE TABLE user_beliefs (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id uuid REFERENCES nodes(id) ON DELETE CASCADE,
  belief_weight numeric CHECK(belief_weight >= 0 AND belief_weight <= 1),
  PRIMARY KEY(user_id, node_id)
);

-- Indexes for performance
CREATE INDEX idx_nodes_topic_id ON nodes(topic_id);
CREATE INDEX idx_nodes_type ON nodes(type);
CREATE INDEX idx_edges_parent ON edges(parent_node);
CREATE INDEX idx_edges_child ON edges(child_node);
CREATE INDEX idx_evidence_node_id ON evidence(node_id);
CREATE INDEX idx_user_beliefs_user_id ON user_beliefs(user_id);

-- Row Level Security
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_beliefs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Topics are viewable by everyone" ON topics FOR SELECT USING (true);
CREATE POLICY "Users can create topics" ON topics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public nodes are viewable by everyone" ON nodes FOR SELECT USING (public = true);
CREATE POLICY "Users can view their own nodes" ON nodes FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Users can create nodes" ON nodes FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own nodes" ON nodes FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Edges are viewable by everyone" ON edges FOR SELECT USING (true);
CREATE POLICY "Users can create edges" ON edges FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public evidence is viewable by everyone" ON evidence FOR SELECT USING (public = true);
CREATE POLICY "Users can view their own evidence" ON evidence FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Users can create evidence" ON evidence FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can view their own beliefs" ON user_beliefs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own beliefs" ON user_beliefs FOR ALL USING (auth.uid() = user_id);
