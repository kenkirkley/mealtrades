// updateData
import axios from 'axios';
import { showAlert } from './alerts';

// type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    console.log(url);
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated Successfuly!`);
      window.setTimeout(() => {
        location.assign('/me');
      }, 1500);
    }

    console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
