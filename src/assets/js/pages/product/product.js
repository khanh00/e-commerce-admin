import axios from 'axios';

const getAllProduct = async (queryString = '') => {
  const result = await axios({
    method: 'GET',
    url: `/api/v1/products${queryString}`,
  });
  return result.data.data.products;
};

const createProduct = async (formData) => {
  const result = await axios({
    method: 'POST',
    url: '/api/v1/products',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return result.data.data.product;
};

const updateProduct = async (id, formData) => {
  const result = await axios({
    method: 'PATCH',
    url: `/api/v1/products/${id}`,
    data: formData,
  });
  return result.data.data.product;
};

const deleteProduct = async (title) => {
  const products = await getAllProduct(`?title=${title}`);
  await axios({
    method: 'DELETE',
    url: `/api/v1/products/${products[0]._id}`,
  });
};

export { getAllProduct, createProduct, updateProduct, deleteProduct };
