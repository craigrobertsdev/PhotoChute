import React from "react";
import { BUY_PREMIUM } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import overSharer from "../assets/images/over-sharer.jpg";
import photoEnthusiast from "../assets/images/photo-enthusiast.jpg";
import socialButterfly from "../assets/images/social-butterfly.jpg";
import "../assets/css/Premium.css";

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
    <div id="premium" className="flex-row justify-center  mb-4 p-4">
      <div>
        <h2 className="altHeading text-center">Upgrade to Premium</h2>
        <h5 className="text-center">
          We offer 3 premium accounts to suit your photo sharing needs!
        </h5>
        <div id="" className="premium-grid row mt-3 justify-center">
          <div className="premiumSelect col-4">
            <h3 className="getter text-center">Photo Enthusiast</h3>
            <img src={photoEnthusiast} />
            <ul className="tagline text-black">
              <li>Up to 5 groups</li>
              <li>Total of 20 storable photos</li>
            </ul>
            <button onClick={() => placeOrder(1)} className="levelOne btn">
              $1.99
            </button>
          </div>
          <div className="premiumSelect col-4">
            <h3 className="getter text-center">Social Butterfly</h3>
            <img src={socialButterfly} />
            <ul className="tagline text-black">
              <li>Up to 10 groups</li>
              <li>Total of 35 storable photos</li>
            </ul>
            <button onClick={() => placeOrder(2)} className="levelTwo btn">
              $5.99
            </button>
          </div>
          <div className="premiumSelect col-4">
            <h3 className="getter text-center">Over Sharer</h3>
            <img src={overSharer} />
            <ul className="tagline text-black">
              <li>Up to 20 groups</li>
              <li>Total of 50 storable photos</li>
            </ul>
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
