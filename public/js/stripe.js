/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51O3e9eJy0od8cKf43DxKD4Xw8ExZtOobeyadd8sf4oLRHOMd5a6TSAhCOXkBt84TtIg2YNROJ3fbMB7eK0osA44j009AirRmgW',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`,
    );

    console.log(session);

    // 2) Create Checkout from  + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};
