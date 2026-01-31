import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: cloudflare({
        platformProxy: {
            enabled: true
        }
    }),
    // 기존 정적 파일들은 public 폴더로 이동하지 않고 그대로 사용
    // Astro는 public/ 폴더의 파일을 그대로 복사함
});
