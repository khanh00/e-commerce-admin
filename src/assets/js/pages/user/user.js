import axios from 'axios';

const login = async (email, password) => {
  const result = await axios({
    method: 'POST',
    url: '/api/v1/users/login',
    data: { email, password },
  });

  return result.data.status;
};

const logout = async () => {
  const result = await axios({
    method: 'GET',
    url: '/api/v1/users/logout',
  });

  return result.data.status;
};

export { login, logout };
