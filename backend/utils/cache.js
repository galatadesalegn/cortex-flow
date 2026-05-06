import NodeCache from 'node-cache';

// Cache for 10 minutes by default
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export const cacheMiddleware = (duration) => (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
        return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
        return res.json(cachedResponse);
    } else {
        // Override res.json to store response in cache
        const originalJson = res.json;
        res.json = (body) => {
            cache.set(key, body, duration);
            return originalJson.call(res, body);
        };
        next();
    }
};

export const clearCache = (pattern) => {
    if (!pattern) {
        cache.flushAll();
        return;
    }

    const keys = cache.keys();
    const keysToDelete = keys.filter(key => key.includes(pattern));
    cache.del(keysToDelete);
};

export default cache;
