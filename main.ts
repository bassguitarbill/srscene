function handler(req: Request): Response {
    return new Response("Hello, World!");
}

import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

serve(handler);
