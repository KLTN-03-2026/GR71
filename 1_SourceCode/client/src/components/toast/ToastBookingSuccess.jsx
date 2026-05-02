import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToastBookingSuccess({ user }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // giả lập khi user đặt thành công
        setShow(true);
        const timer = setTimeout(() => setShow(false), 4000); // tự ẩn sau 4s
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed bottom-5 right-5 bg-green-500 text-white shadow-lg rounded-xl px-5 py-3 flex items-center gap-3"
                >
                    <div className="w-8 h-8 flex items-center justify-center bg-white text-green-600 rounded-full font-bold">
                        ✓
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {user ? `${user} đã đặt tour thành công!` : 'Đặt tour thành công!'}
                        </p>
                        <p className="text-xs text-green-100">Chúc bạn có chuyến đi vui vẻ ✈️</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
