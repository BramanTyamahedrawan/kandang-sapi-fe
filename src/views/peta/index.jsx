import TypingCard from "@/components/TypingCard";
import MapWithChoropleth from "../dashboard/components/Map/MapWithChoropleth";

const cardContent = `Di sini, Anda dapat melihat lokasi data ternak di sistem.`;
const Peta = () => {
  return (
    <div className="app-container">
      <MapWithChoropleth />
    </div>
  );
};

export default Peta;
