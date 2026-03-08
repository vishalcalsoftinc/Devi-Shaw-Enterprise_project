import { createClient } from "@supabase/supabase-js";

// export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);
// export default supabase;

// export const default_store_pic = import.meta.env.VITE_DEFAULT_STORE_PIC;
// export const default_owner_pic = import.meta.env.VITE_DEFAULT_OWNER_PIC;

export const supabaseUrl = "https://nnfnobdpdtdimlugwmig.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5uZm5vYmRwZHRkaW1sdWd3bWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk3NTU2ODMsImV4cCI6MjAzNTMzMTY4M30.96qHPH5FLU17fNc8MX1k2FJ2wFt8ymtCPWDTrAtgsZs";

// export const supabaseUrl = "https://cjnckqgerwqklfqsbcfo.supabase.co";
// const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbmNrcWdlcndxa2xmcXNiY2ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MzUzMjksImV4cCI6MjA1NjQxMTMyOX0.Rt-psnk2StkgcQcbLbO7UvkcEVQyWK00VNRxnqqb6DA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

export const default_store_pic =
  "https://nnfnobdpdtdimlugwmig.supabase.co/storage/v1/object/public/customer_store_pictures/0.38892795734812036-default_store_image.jpg";
export const default_owner_pic =
  "https://nnfnobdpdtdimlugwmig.supabase.co/storage/v1/object/public/customer_owner_pictures/0.034979561436823126-default_store_owner_image.jpeg";
