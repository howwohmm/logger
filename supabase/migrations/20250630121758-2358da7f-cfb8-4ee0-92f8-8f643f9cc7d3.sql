
-- Add upvotes column to ideas table
ALTER TABLE ideas 
ADD COLUMN upvotes text[] DEFAULT '{}';
