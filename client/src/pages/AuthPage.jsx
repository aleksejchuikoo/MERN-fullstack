import React from 'react';

import AuthContext from '../context/AuthContext';
import useHttp from '../hooks/http.hook';
import useMessage from '../hooks/message.hook';

function AuthPage() {
  const auth = React.useContext(AuthContext);
  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();
  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });

  React.useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  React.useEffect(() => {
    window.M.updateTextFields(); // делаем активными поля
  }, []);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      message(data.message);
    } catch (e) {}
  };

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  return (
    <div className="row">
      <div className="col s8 offset-s2">
        <h1 className="red-text darken-2">Сокращение ссылок</h1>
        <div className="card red lighten-5 z-depth-2" style={{ borderRadius: 20 }}>
          <div className="card-content red-text">
            <span className="card-title ">Авторизация</span>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="email"
                  type="email"
                  className="validate"
                  name="email"
                  value={form.email}
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="password"
                  type="password"
                  className="validate"
                  name="password"
                  value={form.password}
                  onChange={changeHandler}
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>
          </div>
          <div
            className="card-action"
            style={{
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              textAlign: 'center',
            }}>
            <button
              className="btn red darken-2"
              onClick={loginHandler}
              style={{ marginRight: 20 }}
              disabled={loading}>
              Войти
            </button>
            <button className="btn red lighten-3" onClick={registerHandler} disabled={loading}>
              Регистрация
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
