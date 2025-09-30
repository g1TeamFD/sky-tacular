import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Check for DATABASE_URL in different locations for Replit compatibility
let databaseUrl = process.env.DATABASE_URL;

// For Replit environment, try reading from file if environment variable is not set
if (!databaseUrl) {
  try {
    const fs = require('fs');
    databaseUrl = fs.readFileSync('/tmp/replitdb', 'utf8').trim();
  } catch (error) {
    // If file doesn't exist, keep trying other methods
  }
}

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });
