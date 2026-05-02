import { motion, useReducedMotion } from 'framer-motion';
import Banner from './components/Banner';
import CategoryHome from './components/CategoryHome';
import ModalChat from './components/chat/ModalChat';
import Header from './components/Header';
import Footer from './components/Footer';

import ProductHome from './components/ProductHome';
import FlashSale from './components/FlashSale';
import FeedbackHome from './components/FeedbackHome';
import BlogHome from './components/BlogHome';
import Chatbot from './components/ChatBot';

function App() {
    // Kiểm tra user preference cho reduced motion
    const shouldReduceMotion = useReducedMotion();

    // Animation variants cho các sections
    const fadeInUp = {
        initial: shouldReduceMotion
            ? { opacity: 0 }
            : {
                  opacity: 0,
                  y: 60,
                  scale: 0.95,
              },
        animate: shouldReduceMotion
            ? { opacity: 1 }
            : {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      staggerChildren: 0.1,
                  },
              },
    };

    const fadeInLeft = {
        initial: shouldReduceMotion
            ? { opacity: 0 }
            : {
                  opacity: 0,
                  x: -60,
                  scale: 0.95,
              },
        animate: shouldReduceMotion
            ? { opacity: 1 }
            : {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                  },
              },
    };

    const fadeInRight = {
        initial: shouldReduceMotion
            ? { opacity: 0 }
            : {
                  opacity: 0,
                  x: 60,
                  scale: 0.95,
              },
        animate: shouldReduceMotion
            ? { opacity: 1 }
            : {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94],
                  },
              },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    return (
        <div>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <Header />
            </motion.header>

            <main>
                {/* Banner - Hero Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    <Banner />
                </motion.div>

                {/* FlashSale - Slide từ trái */}
                <motion.div
                    variants={fadeInLeft}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <FlashSale />
                </motion.div>

                {/* CategoryHome - Slide từ phải */}
                <motion.div
                    variants={fadeInRight}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <CategoryHome />
                </motion.div>

                {/* ProductHome - Fade in up với stagger */}
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <ProductHome />
                </motion.div>

                {/* FeedbackHome - Scale animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                            duration: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        },
                    }}
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <FeedbackHome />
                </motion.div>

                {/* BlogHome - Rotate và fade */}
                <motion.div
                    initial={{ opacity: 0, rotateX: -15 }}
                    whileInView={{
                        opacity: 1,
                        rotateX: 0,
                        transition: {
                            duration: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        },
                    }}
                    viewport={{ once: true, margin: '-100px' }}
                >
                    <BlogHome />
                </motion.div>

                {/* ModalChat - Floating animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                            duration: 0.5,
                            delay: 1,
                            ease: 'easeOut',
                        },
                    }}
                >
                    <ModalChat />
                </motion.div>

                {/* Chatbot - Bounce animation */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.6,
                            delay: 1.5,
                            ease: [0.68, -0.55, 0.265, 1.55],
                        },
                    }}
                >
                    <Chatbot />
                </motion.div>
            </main>

            {/* Footer - Slide từ dưới lên */}
            <motion.footer
                className="mt-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    },
                }}
                viewport={{ once: true, margin: '-50px' }}
            >
                <Footer />
            </motion.footer>
        </div>
    );
}

export default App;
