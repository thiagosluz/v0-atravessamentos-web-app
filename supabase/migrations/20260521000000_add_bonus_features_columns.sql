-- Migration to add member_ids to projects and likes to gallery_assets

-- Add member_ids to projects
ALTER TABLE projects ADD COLUMN member_ids TEXT[] DEFAULT '{}';

-- Add likes to gallery_assets
ALTER TABLE gallery_assets ADD COLUMN likes INTEGER DEFAULT 0;
