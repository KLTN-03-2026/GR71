import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { router } from './routes';
import { Provider } from './store/Provider';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider>
            <Router>
                <Routes>
                    {router.map((route) => (
                        <Route key={route.path} path={route.path} element={route.component} />
                    ))}
                </Routes>
            </Router>
        </Provider>
    </StrictMode>,
);
