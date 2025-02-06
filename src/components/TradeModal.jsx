import { IoClose } from 'react-icons/io5';

function TradeModal({ isOpen, onClose, trade, onClosePosition }) {
  if (!isOpen || !trade) return null;

  return (
    <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] relative top-[40%] h-[400px] rounded-lg w-full  mx-4">
       
        <div className="p-8 space-y-3">
          <button
            onClick={() => onClosePosition(trade.id)}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Close position
          </button>
         
        </div>
      </div>
    </div>
  );
}

export default TradeModal;