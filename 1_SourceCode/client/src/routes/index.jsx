import App from '../App';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Admin from '../pages/admin/index';
import DetailProduct from '../pages/DetailProduct';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import PaymentSuccess from '../pages/PaymentSuccess';
import InfoUser from '../pages/infoUser';
import Blog from '../pages/Blog';
import DetailBlogPage from '../pages/DetailBlogPage';
import InfoWebsite from '../pages/InfoWebsite';
import Contact from '../pages/Contact';
import SearchTour from '../pages/SearchTour';
import ForgotPassword from '../pages/ForgotPassword';

export const router = [
    {
        path: '/',
        component: <App />,
    },
    {
        path: '/register',
        component: <Register />,
    },
    {
        path: '/login',
        component: <Login />,
    },
    {
        path: '/admin',
        component: <Admin />,
    },
    {
        path: '/detail-product/:id',
        component: <DetailProduct />,
    },
    {
        path: '/cart',
        component: <Cart />,
    },
    {
        path: '/checkout',
        component: <Checkout />,
    },
    {
        path: '/payment-success/:id',
        component: <PaymentSuccess />,
    },
    {
        path: '/info-user',
        component: <InfoUser />,
    },
    {
        path: '/blog',
        component: <Blog />,
    },
    {
        path: '/blog/:id',
        component: <DetailBlogPage />,
    },
    {
        path: '/info-website',
        component: <InfoWebsite />,
    },
    {
        path: '/contact',
        component: <Contact />,
    },
    {
        path: '/search-tour',
        component: <SearchTour />,
    },
    {
        path: '/forgot-password',
        component: <ForgotPassword />,
    },
];
