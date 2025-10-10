export const dynamic = "force-dynamic";

import GraphAreaCharity from "../components/GraphAreaCharity";
import organizations from "@/app/data/organizations.json";
import ListItemClient from "../components/ListItemClient";
import "../globals.css";
import BackCoin from "../components/backButton";
import { config } from "@/config";

export default function Index() {
  return (
    <div className="text-black min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 p-4 m-0">
      <BackCoin uri={`${config.apiBaseUrl}/`} />

      <div className="mb-3 ml-3 text-2xl text-white font-bold">Сайн үйлс</div>
      <GraphAreaCharity />
      <div className="pt-3 pl-2">
        <h2 className="text-xl text-white font-bold mb-4">
          Байгууллагууд
        </h2>
        <ListItemClient data={organizations} url="organizations" />
      </div>
    </div>
  );
}
