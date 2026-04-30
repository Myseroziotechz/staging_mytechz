-- ============================================================================
-- Extensions required by the jobs feature
-- ============================================================================
-- Apply on MyTechz Supabase project ref: aiycgmrubisaxknbeaov
-- DO NOT apply on Supabase-GS / Google Studio.
-- ============================================================================

create extension if not exists pg_trgm;
create extension if not exists unaccent;
-- pgvector is optional (used later by AI matching). Skip if not enabled in project.
-- create extension if not exists vector;
