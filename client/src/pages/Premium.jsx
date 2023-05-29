import React from 'react';
import {BUY_PREMIUM} from '../utils/mutations'
import { useMutation } from '@apollo/client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51NBap4GOWFX5kO3G2CJEbUNpCY4pTx8GlmGczPNeFf8WUYgSg0xju3acib4PcIVvmStyNcQV0XeBUWVzxmB8yKmB00xJzsTSQf');

const Premium = () => {
    const [buyPremium, { error, data }] = useMutation(BUY_PREMIUM);

    const placeOrder = async (premiumSelection) => {
        try {
            const { data } = await buyPremium({
              variables: { premium: premiumSelection },
            });

            stripePromise.then((res) => {
                console.log(data.buyPremium)
                res.redirectToCheckout({ sessionId: data.buyPremium.session });
            });
      
          } catch (e) {
            console.error(e);
          }
    }

    return (
        <div>
            <h1>
                Upgrade to Premium
            </h1>
            <h2>
                We offer 3 premium accounts to suit your photo sharing needs
            </h2>
            <div className='premiumSelect'>
                <h3>Photo Enthusiast</h3>
                <button onClick={() => placeOrder(1)} className='levelOne'>$1.99</button>
            </div>
            <div>
                <h3>Social Butterfly</h3>
                <button onClick={() => placeOrder(2)} className='levelTwo'>$5.99</button>
            </div>
            <div>
                <h3>Over Sharer</h3>
                <button  onClick={() => placeOrder(3)} className='levelThree'>$9.99</button>
            </div>
        </div>
    );
  }
  
  export default Premium; 