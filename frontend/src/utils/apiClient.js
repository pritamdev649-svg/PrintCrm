const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient = async (path, options = {}) => {
  const token = localStorage.getItem('printcrm_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const method = options.method || 'GET';
  
  // High-end console logger for request
  console.log(
    `%c[API Request] %c${method}%c ${path}`,
    'color: #4db39a; font-weight: bold; padding: 2px; border-radius: 4px;',
    'color: #ffffff; background: #e8521a; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
    'color: #1f2724; font-weight: 500;',
    options.body ? JSON.parse(options.body) : ''
  );

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error(
        `%c[API Error] %c${response.status}%c ${path}`,
        'color: #c41a1a; font-weight: bold;',
        'color: #ffffff; background: #c41a1a; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
        'color: #1f2724;',
        data.message || 'API request failed'
      );
      throw new Error(data.message || 'API request failed');
    }

    // High-end console logger for response
    console.log(
      `%c[API Response] %c${response.status}%c ${path}`,
      'color: #1a7a4a; font-weight: bold;',
      'color: #ffffff; background: #1a7a4a; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
      'color: #1f2724;',
      data
    );

    return data;
  } catch (error) {
    console.error(`%c[API Connection Error] %c${path}`, 'color: #c41a1a; font-weight: bold;', 'color: #1f2724;', error);
    throw error;
  }
};
