import home from "./pages-data/home";
import catalog from "./pages-data/catalog";
import contacts from "./pages-data/contacts";
import product from "./pages-data/product";
import inDevelopment from "./pages-data/in-development";
import showroom from "./pages-data/showroom";
import payment from "./pages-data/payment";
import terms from "./pages-data/terms";
import refund from "./pages-data/refund";
import guarantee from "./pages-data/guarantee";

const pagesConfig = {
  ...home,
  ...catalog,
  ...contacts,
  ...product,
  ...inDevelopment,
  ...showroom,
  ...payment,
  ...terms,
  ...refund,
  ...guarantee,
};

export default pagesConfig;
