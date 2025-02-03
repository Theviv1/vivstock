import WelcomeHeader from '../components/home/WelcomeHeader';
import TradingCard from '../components/home/TradingCard';
import ActionButtons from '../components/home/ActionButtons';
import PopularStocks from '../components/home/PopularStocks';
import CopyTrade from '../components/home/CopyTrade';
import ActivityChart from '../components/home/ActivityChart';

function Home() {
  return (
    <div className="px-4 py-6 overflow-x-hidden">
      <WelcomeHeader />
      <TradingCard />
      <ActionButtons />
      <ActivityChart />
      <PopularStocks />
      <CopyTrade />
    </div>
  );
}

export default Home;