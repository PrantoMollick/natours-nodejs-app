import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const urlType = type === 'password' ? 'updateMyPassword' : 'updateMe';

    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:3000/api/v1/users/${urlType}`,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `User ${type.toUpperCase()} Successfully updated!`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
