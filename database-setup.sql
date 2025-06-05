-- Create the parliament_data_raw table
CREATE TABLE parliament_data_raw (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL,
  record_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for better query performance
CREATE INDEX idx_parliament_data_raw_fetched_at ON parliament_data_raw(fetched_at);

-- Test the table creation
SELECT 'Table created successfully!' as status; 