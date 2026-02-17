/// <reference types="astro/client" />

// Cloudflare Workers runtime type for Astro locals
interface CloudflareEnv {
    R2_BUCKET: R2Bucket;
    SESSION: KVNamespace;
    [key: string]: unknown;
}

declare namespace App {
    interface Locals {
        runtime: {
            env: CloudflareEnv;
            ctx: ExecutionContext;
        };
    }
}
