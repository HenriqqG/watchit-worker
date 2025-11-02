import { Redis } from '@upstash/redis'; 

const url = process.env.UPSTASH_REDIS_REST_URL ? process.env.UPSTASH_REDIS_REST_URL.trim() : undefined;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ? process.env.UPSTASH_REDIS_REST_TOKEN.trim() : undefined;

let redis: Redis;

if (url && token) {
    console.log('[REDIS] Conectando-se via REST API da Upstash (Produção).');
    redis = new Redis({ url, token });
    
} else {
    console.error("AVISO CRÍTICO: Variáveis de Redis REST não configuradas. O cache ESTÁ DESABILITADO.");
    
    const mockRedis = {
        get: () => Promise.resolve(null),
        set: () => Promise.resolve(true),
    } as unknown as Redis; 
    
    redis = mockRedis;
}

export default redis;