// import { createClient } from "@supabase/supabase-js";
// export const supabaseUrl = "https://lsahafwrlmueiqbiltyl.supabase.co";
// const supabaseKey =
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzYWhhZndybG11ZWlxYmlsdHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzMDQwOTIsImV4cCI6MjA1Mzg4MDA5Mn0.Jxwj_47z0zqj0KO9reDQhAwc4R4VnYG37qdW60cf9jo";
// const supabase = createClient(supabaseUrl, supabaseKey);

// export default supabase;

// Below are the credentials for the-wild-oasis2

import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
