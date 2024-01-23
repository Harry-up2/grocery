import Home from "./components/Home.js"
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import ManagerRequests from "./components/ManagerRequests.js";
import SectionRequests from "./components/SectionRequests.js";
import SectionManagement from "./components/SectionManagement.js";
import ProductManagement from "./components/ProductManagement.js";
import UserCart from "./components/UserCart.js";
import PreviousPurchases from "./components/PreviousPurchases.js";
import ShopByProduct from "./components/ShopByProduct.js";

const routes = [
    { path: '/', component: Home },
    {path: '/login', component: Login,name:'Login'},
    {path: '/manager-requests', component: ManagerRequests},
    {path: '/register', component: Register},
    {path: '/section-requests', component: SectionRequests},
    {path: '/section-management', component: SectionManagement},
    {path: '/product-management', component: ProductManagement},
    { path: '/user-cart', component: UserCart },
    { path: '/purchase-history', component: PreviousPurchases },
    { path: '/shop-by-product', component: ShopByProduct },
]

export default new VueRouter({
    routes,
});