import Context from './Context';
import CryptoJS from 'crypto-js';

import cookies from 'js-cookie';

import { useEffect, useState, useRef } from 'react';
import { requestAuth } from '../config/UserRequest';
import { ToastContainer } from 'react-toastify';
import { requestGetCartByUserId } from '../config/CartRequest';

import { io } from 'socket.io-client';
import { requestGetConversationByUserId } from '../config/MessageRequest';

export function Provider({ children }) {
    const [dataUser, setDataUser] = useState({});
    const [dataCart, setDataCart] = useState({});
    const [counpon, setCounpon] = useState([]);
    const [usersWatchingProduct, setUsersWatchingProduct] = useState({});
    const [dataConversation, setDataConversation] = useState();
    const [newMessage, setNewMessage] = useState();

    const socketRef = useRef(null);

    const fetchAuth = async () => {
        try {
            const res = await requestAuth();
            const bytes = CryptoJS.AES.decrypt(res.metadata, import.meta.env.VITE_SECRET_CRYPTO);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            if (!originalText) {
                console.error('Failed to decrypt data');
                return;
            }
            const user = JSON.parse(originalText);
            setDataUser(user);
        } catch (error) {
            console.error('Auth error:', error);
        }
    };

    const fetchCart = async () => {
        const res = await requestGetCartByUserId();
        setCounpon(res.metadata.coupon);
        setDataCart(res.metadata.cart);
    };

    const fetchConversation = async () => {
        const res = await requestGetConversationByUserId();
        setDataConversation(res.metadata._id);
    };

    useEffect(() => {
        const token = cookies.get('logged');

        if (!token) {
            return;
        }
        fetchAuth();
        fetchCart();
    }, []);

    useEffect(() => {
        if (dataUser?.isAdmin === false) {
            fetchConversation();
        }
    }, [dataUser]);

    useEffect(() => {
        if (!dataUser._id) return;

        const socket = io(import.meta.env.VITE_API_URL, {
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on('usersWatchingProduct', (data) => {
            setUsersWatchingProduct(data);
        });

        socket.on('new_message', (data) => {
            setNewMessage(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [dataUser._id]);

    return (
        <Context.Provider
            value={{
                dataUser,
                fetchAuth,
                dataCart,
                fetchCart,
                dataConversation,
                counpon,
                usersWatchingProduct,
                newMessage,
            }}
        >
            {children}
            <ToastContainer />
        </Context.Provider>
    );
}
