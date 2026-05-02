import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotifyViewTour({ user }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // giả lập có người dùng khác xem tour
        setTimeout(() => setShow(true), 1000); // sau 1s thì hiện
        setTimeout(() => setShow(false), 5000); // sau 5s thì ẩn
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ x: -300, opacity: 0 }} // bắt đầu từ bên trái
                    animate={{ x: 0, opacity: 1 }} // trượt vào giữa
                    exit={{ x: -300, opacity: 0 }} // trượt ra lại bên trái
                    transition={{ duration: 0.5 }}
                    className="fixed top-25 left-5 bg-white border border-gray-200 shadow-lg rounded-xl p-4 flex items-center gap-3"
                >
                    <div className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
                        👤
                    </div>
                    <div>
                        <p className="text-sm text-gray-800 font-medium">
                            {user ? `${user} cũng đang xem tour này!` : 'Một người dùng cũng đang xem tour này!'}
                        </p>
                        <p className="text-xs text-gray-500">Hãy nhanh tay đặt để giữ chỗ.</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
