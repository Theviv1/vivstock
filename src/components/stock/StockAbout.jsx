import { useNavigate } from 'react-router-dom';

function StockAbout({ name, about }) {
  return (
    <div className="mb-8 h-full">
      <h2 className="text-2xl font-bold mb-4">About {name}</h2>
      <p className="text-gray-300 leading-relaxed">
        {about || `${name} is a company listed on the stock exchange. No additional information is available at this time.`}
      </p>
    </div>
  );
}

export default StockAbout;