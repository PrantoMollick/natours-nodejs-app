import axios from 'axios';
import { showAlert } from './alerts';

export const updateUserHandler = async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User Successfully updated!');
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
