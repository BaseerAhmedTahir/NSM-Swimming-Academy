import { z } from 'zod';

// We don't have many body payloads, mostly GET endpoints.
// But we use this for route param validation if using validate middleware on params.
// We'll trust the UUIDs for now, or add simple schemas if needed.
