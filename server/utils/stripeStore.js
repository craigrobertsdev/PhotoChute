const shop = document.querySelector('premiumButton')

shop.addEventListener('click', () => {
    fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

    })
})


const premiumAccounts = new Map([
    [1, {price: 199, class: "Photo Enthusiast"}],
    [2, {price: 599, class: "Social Butterfly"}],
    [3, {price: 999, class: "Over Sharer"}],
])

module.exports = premiumAccounts