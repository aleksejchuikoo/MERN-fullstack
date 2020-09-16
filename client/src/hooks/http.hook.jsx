import React from 'react';

const useHttp = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const request = React.useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    // для того, чтобы не было рекурсии
    setLoading(true);
    try {
      if (body) {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        // метод fetch первым пар-ом принимает url, а вторым набор опций
        method,
        body,
        headers,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Что-то не так');
      }
      setLoading(false);

      return data;
    } catch (e) {
      setLoading(false);
      setError(e.message);

      throw e;
    }
  }, []);

  const clearError = React.useCallback(() => setError(null), []);

  return { loading, request, error, clearError };
};

export default useHttp;
