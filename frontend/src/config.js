// Centralized API and backend configuration
// Using Vite proxy - all requests to /api, /uploads are proxied to backend

const BACKEND_URL = ''; // Empty string = use proxy (for development)

export const API_URL = `${BACKEND_URL}/api`;
export const UPLOAD_URL = (path) => `${BACKEND_URL}${path}`;

export default BACKEND_URL;