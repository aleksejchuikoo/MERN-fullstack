import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import LinkCart from '../components/LinkCart';

import Loader from '../components/Loader';
import AuthContext from '../context/AuthContext';
import useHttp from '../hooks/http.hook';

function DetailsPage() {
  const { token } = useContext(AuthContext);
  const { request, loading } = useHttp();
  const [link, setLink] = React.useState(null);
  const linkId = useParams().id;

  const getLink = React.useCallback(async () => {
    try {
      const fetched = await request(`/api/link/${linkId}`, 'GET', null, {
        Authorization: `Bearer ${token}`,
      });
      setLink(fetched);
    } catch (error) {}
  }, [token, linkId, request]);

  React.useEffect(() => {
    getLink();
  }, [getLink]);

  if (loading) {
    return <Loader />;
  }

  return <>{!loading && link && <LinkCart link={link} />}</>;
}

export default DetailsPage;
