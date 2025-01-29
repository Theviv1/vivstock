import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({
    name: '',
    symbol: '',
    price: '',
    logo: '',
    isUSD: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .order('name');

      if (error) throw error;
      setStocks(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('stocks')
        .insert([newStock]);

      if (error) throw error;

      setNewStock({
        name: '',
        symbol: '',
        price: '',
        logo: '',
        isUSD: false
      });
      fetchStocks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteStock = async (id) => {
    try {
      const { error } = await supabase
        .from('stocks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchStocks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <AdminSidebar />
      <div className="lg:pl-64 p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Stocks</h1>

        <form onSubmit={handleAddStock} className="bg-[#1A1A1A] p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Stock Name"
              value={newStock.name}
              onChange={(e) => setNewStock({...newStock, name: e.target.value})}
              className="bg-[#2A2A2A] p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Symbol"
              value={newStock.symbol}
              onChange={(e) => setNewStock({...newStock, symbol: e.target.value})}
              className="bg-[#2A2A2A] p-2 rounded"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newStock.price}
              onChange={(e) => setNewStock({...newStock, price: e.target.value})}
              className="bg-[#2A2A2A] p-2 rounded"
              required
            />
            <input
              type="url"
              placeholder="Logo URL"
              value={newStock.logo}
              onChange={(e) => setNewStock({...newStock, logo: e.target.value})}
              className="bg-[#2A2A2A] p-2 rounded"
              required
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newStock.isUSD}
                onChange={(e) => setNewStock({...newStock, isUSD: e.target.checked})}
                className="mr-2"
              />
              <label>Is USD Stock</label>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-[#7F3DFF] text-white px-4 py-2 rounded hover:bg-[#6F2FEF]"
          >
            Add Stock
          </button>
        </form>

        {loading ? (
          <div className="text-center">Loading stocks...</div>
        ) : (
          <div className="grid gap-4">
            {stocks.map((stock) => (
              <div key={stock.id} className="bg-[#1A1A1A] p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img
                    src={stock.logo}
                    alt={stock.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{stock.name}</h3>
                    <p className="text-sm text-gray-400">{stock.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    {stock.isUSD ? '$' : '₦'}{stock.price}
                  </span>
                  <button
                    onClick={() => handleDeleteStock(stock.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}