let csrfToken = null;

export const fetchCsrfToken = async () => {
    try {
        const res = await fetch('/api/admin/csrf-token');
        const data = await res.json();
        csrfToken = data.csrfToken;
        return csrfToken;
    } catch (e) {
        console.error('Failed to fetch CSRF token', e);
        return null;
    }
};

export const apiFetch = async (url, options = {}) => {
    if (['POST', 'PUT', 'DELETE'].includes(options.method)) {
        if (!csrfToken) await fetchCsrfToken();
        
        options.headers = {
            ...options.headers,
            'x-csrf-token': csrfToken
        };
    }
    
    // Auto JSON stringify if body is object and not FormData
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        options.body = JSON.stringify(options.body);
        options.headers = {
            ...options.headers,
            'Content-Type': 'application/json'
        };
    }

    const res = await fetch(url, options);
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.error || 'API Request Failed');
    }
    
    return data;
};
