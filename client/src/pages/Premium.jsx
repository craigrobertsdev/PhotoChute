import React from 'react';
var premiumSelection = ''

const premiumSelector = (selection) => {
        premiumSelection = { id: (selection), quantity: 1 }

        console.log(premiumSelection)
}

const Premium = () => {
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
                <button onClick={() => premiumSelector(1)} className='levelOne'>$1.99</button>
            </div>
            <div>
                <h3>Social Butterfly</h3>
                <button onClick={() =>premiumSelector(2)} className='levelTwo'>$5.99</button>
            </div>
            <div>
                <h3>Over Sharer</h3>
                <button  onClick={() =>premiumSelector(3)} className='levelThree'>$9.99</button>
            </div>
        </div>
    );
  }
  
  export default Premium; 