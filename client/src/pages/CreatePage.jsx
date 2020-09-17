import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../context/AuthContext';
import useHttp from '../hooks/http.hook';

function CreatePage() {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { request } = useHttp();
  const [link, setLink] = React.useState('');

  const linkHandler = (e) => {
    setLink(e.target.value);
  };

  React.useEffect(() => {
    window.M.updateTextFields(); // делаем активными поля
  }, []);

  const pressHandler = async (e) => {
    if (e.key === 'Enter') {
      try {
        const data = await request(
          '/api/link/generate',
          'POST',
          { from: link },
          {
            Authorization: `Bearer ${auth.token}`,
          },
        );
        history.push(`/details/${data.link._id}`); //переходим на новую стр с тем id, который относится к этой ссылке
      } catch (error) {}
    }
  };
  return (
    <div className="row">
      <div className="col s12" style={{ paddingTop: '2rem' }}>
        <div className="input-field">
          <input
            placeholder="Вставьте ссылку"
            id="link"
            type="text"
            value={link}
            onChange={linkHandler}
            onKeyPress={pressHandler}
          />
          <label htmlFor="link">Введите ссылку</label>
        </div>
      </div>
    </div>
  );
}

export default CreatePage;
