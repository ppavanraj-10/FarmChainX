import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, productAPI, orderAPI } from '../services/api.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  // Restore session on app load
  useEffect(() => {
    const token = localStorage.getItem('fcx_token');
    if (token) {
      authAPI.getMe()
        .then(data => setUser(data.user))
        .catch(() => localStorage.removeItem('fcx_token'))
        .finally(() => setLoadingAuth(false));
    } else {
      setLoadingAuth(false);
    }
  }, []);

  // Load products when user logs in
  useEffect(() => {
    if (user) {
      fetchProducts();
      if (user.role === 'consumer') fetchOrders();
    }
  }, [user]);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await productAPI.getAll();
      const normalized = data.products.map(p => ({ ...p, id: p.productId }));
      setProducts(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderAPI.getMine();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('fcx_token', data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const data = await authAPI.register(formData);
      localStorage.setItem('fcx_token', data.token);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('fcx_token');
    setUser(null);
    setProducts([]);
    setOrders([]);
  };

  const addProduct = async (productData) => {
    try {
      const data = await productAPI.create(productData);
      const normalized = { ...data.product, id: data.product.productId };
      setProducts(prev => [normalized, ...prev]);
      return { success: true, product: normalized };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const runAIAnalysis = async (productId) => {
    try {
      const data = await productAPI.runAI(productId);
      const normalized = { ...data.product, id: data.product.productId };
      setProducts(prev => prev.map(p => p.id === productId ? normalized : p));
      return { success: true, product: normalized };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTransportStage = async (productId, stage) => {
    try {
      const data = await productAPI.updateTransport(productId, stage);
      const normalized = { ...data.product, id: data.product.productId };
      setProducts(prev => prev.map(p => p.id === productId ? normalized : p));
      return { success: true, product: normalized };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const markReceived = async (productId) => {
    try {
      const data = await productAPI.markReceived(productId);
      const normalized = { ...data.product, id: data.product.productId };
      setProducts(prev => prev.map(p => p.id === productId ? normalized : p));
      return { success: true, product: normalized };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const generateQR = async (productId) => {
    try {
      const data = await productAPI.generateQR(productId);
      const normalized = { ...data.product, id: data.product.productId };
      setProducts(prev => prev.map(p => p.id === productId ? normalized : p));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const verifyProduct = async (productId) => {
    try {
      const data = await productAPI.verify(productId);
      return { success: true, product: { ...data.product, id: data.product.productId } };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const placeOrder = async (orderData) => {
    try {
      const data = await orderAPI.create(orderData);
      setOrders(prev => [data.order, ...prev]);
      await fetchProducts();
      return { success: true, order: data.order, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-sm font-mono">Loading FarmChainX...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      user, login, register, logout,
      products, loadingProducts, fetchProducts,
      addProduct, runAIAnalysis, updateTransportStage, markReceived, generateQR,
      verifyProduct, placeOrder, orders, fetchOrders,
      error, setError,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
