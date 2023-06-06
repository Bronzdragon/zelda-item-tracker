import "./App.css";
import { ArmourItem } from "./types";
import { useState } from "react";
import ArmourSection from "./components/ArmourSection";
import Collapsible from "./components/Collapsible";
import { Requirement } from "./types";
import MaterialSection from "./components/MaterialSection";

function App() {
  const [armourList, setArmourList] = useState<Array<ArmourItem>>([]);

  return (
    <div className="App">
      {/* <header>
        <h1>Zelda: Tears of The Kingdom™ — Item Tracker</h1>
      </header> */}
      <Collapsible>
        <ArmourSection
          armourList={armourList}
          onUpdateItemList={setArmourList}
        />
      </Collapsible>
      <Collapsible>
        <MaterialSection materials={getMaterialsFromArmours(armourList)} />
      </Collapsible>
    </div>
  );
}

export default App;

function getMaterialsFromArmours(armours: ArmourItem[]) {
  console.log("Armour", armours);
  const allRequirements = armours.flatMap((armour) =>
    armour.requirements.map<[string, number]>((req) => [req.name, req.amount])
  );

  const obj = allRequirements.reduce<Record<string, Requirement>>(
    (acc, [name, amount]) => {
      if (name) {
        acc[name] ??= { name, amount: 0 };
        acc[name].amount += amount;
      }

      return acc;
    },
    {}
  );

  return Object.values(obj);
}
