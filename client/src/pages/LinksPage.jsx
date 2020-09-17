import React, { useContext } from 'react';

import LinkList from '../components/LinkList';
import Loader from '../components/Loader';
import AuthContext from '../context/AuthContext';
import useHttp from '../hooks/http.hook';

function LinksPage() {
  const [links, setLinks] = React.useState('');
  const { loading, request } = useHttp();
  const { token } = useContext(AuthContext);

  const fetchLinks = React.useCallback(async () => {
    try {
      const fetched = await request('/api/link', 'GET', null, {
        Authorization: `Bearer ${token}`,
      });
      setLinks(fetched);
    } catch (error) {}
  }, [token, request]);

  React.useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  if (loading) {
    return <Loader />;
  }

  return <>{!loading && <LinkList links={links} />}</>;
}

export default LinksPage;
