import axios from 'axios';

const getAllCategory = async (queryString = '') => {
  const result = await axios({
    method: 'GET',
    url: `/api/v1/categories${queryString}`,
  });
  return result.data.data.categories;
};

const getCategory = async (id) => {
  const result = await axios({
    method: 'GET',
    url: `/api/v1/categories/${id}`,
  });
  return result.data.data.category;
};

export { getAllCategory, getCategory };
