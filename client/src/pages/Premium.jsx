import React from "react";
import { BUY_PREMIUM } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";

//load stripe with public key that will be confirmed by the private key in resolvers
const stripePromise = loadStripe(
  "pk_test_51NBap4GOWFX5kO3G2CJEbUNpCY4pTx8GlmGczPNeFf8WUYgSg0xju3acib4PcIVvmStyNcQV0XeBUWVzxmB8yKmB00xJzsTSQf"
);

//function to call mutation with selection id and return session that is used to redirect to checkout page
const Premium = () => {
  const [buyPremium, { error, data }] = useMutation(BUY_PREMIUM);

  //premiumSelection tells the mutation which option was selected
  const placeOrder = async (premiumSelection) => {
    try {
      const { data } = await buyPremium({
        variables: { premium: premiumSelection },
      });

      //redirect for url to send user to checkout
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.buyPremium.session });
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-row justify-center mb-4">
      <div className="col-8">
        <h2 className="altHeading">Upgrade to Premium</h2>
        <h5>We offer 3 premium accounts to suit your photo sharing needs!</h5>
        <div className="row">
          <div className="premiumSelect col-4">
            <h3 className="getter">Photo Enthusiast</h3>
            <p className="tagline">
              Up to 5 groups <br></br>Total of 20 storable photos
            </p>
            <button onClick={() => placeOrder(1)} className="levelOne btn">
              $1.99
            </button>
          </div>
          <div className="col-4">
            <h3 className="getter">Social Butterfly</h3>
            <p className="tagline">
              Up to 10 groups <br></br>Total of 35 storable photos
            </p>
            <button onClick={() => placeOrder(2)} className="levelTwo btn">
              $5.99
            </button>
          </div>
          <div className="col-4">
            <h3 className="getter">Over Sharer</h3>
            <p className="tagline">
              Up to 20 groups <br></br>Total of 50 storable photos
            </p>
            <button onClick={() => placeOrder(3)} className="levelThree btn">
              $9.99
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
