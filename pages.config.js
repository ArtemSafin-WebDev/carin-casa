import home from "./pages-data/home";
import catalog from "./pages-data/catalog";
import contacts from "./pages-data/contacts";
import product from "./pages-data/product";
import inDevelopment from "./pages-data/in-development";

const pagesConfig = {
  ...home,
  ...catalog,
  ...contacts,
  ...product,
  ...inDevelopment,
};

export default pagesConfig;
