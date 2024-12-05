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
    removeProductModalTitle: "Remove item from your cart",
    confirmRemoveButton: "Save", //In my opinion, this button text might be a bit misleading, maybe better will be "Remove" or "Confirm"
    emptyCartMessage: "You have no items in your shopping cart at the moment.",
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
    removeProductModalTitle: "Usuń produkt z koszyka",
    confirmRemoveButton: "Zapisz",
    emptyCartMessage: "W tym momencie Twój koszyk jest pusty.",
  },
};

export const getLocalization = (market: Market) => localization[market];
