import { Market } from "./markets";

export const localization = {
  UK: {
    cookiesConsent: "GOT IT",
    ageConfirmation: "Yes, discover more",
    shopLinkText: "Shop",
    seeAllProducts: "See all the products",
    buyNowButton: "Buy Now",
    addToCartButton: "Add to cart",
    checkoutButton: "Checkout",
    yourCart: "Your cart",
    removeProduct: "Remove item",
    productName: "Ploom X Advanced",
  },
  PL: {
    cookiesConsent: "Akceptuj wszystkie pliki cookie",
    ageConfirmation: "Potwierdź",
    shopLinkText: "Sklep",
    seeAllProducts: "Zobacz wszystkie produkty",
    buyNowButton: "Kup teraz",
    addToCartButton: "Dodaj do koszyka",
    checkoutButton: "Realizacja zamówienia",
    yourCart: "Twój koszyk",
    removeProduct: "Usuń produkt",
    productName: "Ploom X Advanced",
  },
};

export const getLocalization = (market: Market) => localization[market];
