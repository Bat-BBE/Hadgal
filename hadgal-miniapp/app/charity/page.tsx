export const dynamic = "force-dynamic";

import GraphArea from "../components/GraphArea";
import ListItem from "../components/ListItem";
import "../globals.css";
import BackCoin from "../components/backButton";
import { config } from "@/config";

export default function Index() {
  return (
    <div className="text-black rounded-2xl bg-color m-0">
      <BackCoin uri={`${config.apiBaseUrl}/`} />
      <div className="m-3 text-2xl">Сайн үйлс</div>
      <GraphArea />
      <ListItem 
        title="Сайн үйлсийн байгууллагууд" 
        url="organizations" 
      />
    </div>
  );
}
