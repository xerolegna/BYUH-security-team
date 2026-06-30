import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://ehyormtktzjyekhiaftd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoeW9ybXRrdHpqeWVraGlhZnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3ODg2MjgsImV4cCI6MjA5ODM2NDYyOH0.CJUpJXZAHyhIYVMqE3GLX70omJgg-hF4ukIvbCi19PU'
);
