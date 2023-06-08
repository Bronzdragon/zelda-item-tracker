import { useEffect, useState } from "react";
import { ArmourItem, Requirement } from "../types";
import styles from "./ItemEdit.module.css";

type TypeOfEdit = "new" | "edit";

interface props {
  onSubmit?: (newItem: ArmourItem) => void;
  details?: ArmourItem;
  editType: TypeOfEdit;
}

function ItemEdit({ onSubmit, details, editType = "new" }: props) {
  const [name, setName] = useState(details?.name ?? "");
  const [requirements, setRequirements] = useState<Requirement[]>(() => details?.requirements ?? []);

  useEffect(() => {
    if (requirements.length >= 4) return;
    setRequirements([...requirements, ...getDefaultRequirements()].slice(0, 4));
  }, [requirements, setRequirements]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (name === "") return;

        onSubmit?.({ name, requirements: requirements.filter((req) => req.name && req.amountRequired) });
        setName("");
        setRequirements(getDefaultRequirements());
      }}
    >
      <label htmlFor="name" className={styles.label}>
        Armour name
      </label>
      <br />
      <input
        type="text"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Armour piece..."
      ></input>
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>count</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map((requirement, index) => (
            <RequirementInput
              key={index}
              value={requirement}
              onChange={(newValue) => {
                if (!newValue.name) newValue.amountRequired = 0;
                setRequirements((oldRequirements) => [
                  ...oldRequirements.slice(0, index),
                  newValue,
                  ...oldRequirements.slice(index + 1),
                ]);
              }}
            />
          ))}
        </tbody>
      </table>

      <button className={styles.button} type="submit">
        {editType === "new" ? "Add" : "Update"}
      </button>
    </form>
  );
}

export default ItemEdit;

interface RequirementInputProps {
  value: Requirement;
  onChange: (newValue: Requirement) => void;
}

function RequirementInput({ value: { name, amountRequired: amount }, onChange }: RequirementInputProps) {
  // console.log("Creating requirements field... current value: ", name, amount);

  return (
    <tr>
      <td>
        <input
          type="text"
          name={`item`}
          value={name}
          placeholder="Material..."
          onChange={(event) => onChange({ name: event.target.value, amountRequired: amount })}
        />
      </td>
      <td>
        <input
          type="number"
          min={0}
          step={1}
          name={`amount`}
          className={styles["number-input"]}
          value={amount}
          onChange={(event) => onChange({ name, amountRequired: Number(event.target.value) })}
        />
      </td>
    </tr>
  );
}

// function assertIsHTMLFormElement(e: EventTarget | null): asserts e is HTMLFormElement {
//   if (!(e instanceof HTMLFormElement)) {
//     throw new TypeError("Not a form element!");
//   }
// }

// function zip<T>(...arrays: T[][]): T[][] {
//   const length = Math.max(...arrays.map((arr) => arr.length));
//   return Array.from({ length }, (_, i) => arrays.map((arr) => arr[i]));
// }

function getDefaultRequirements(count = 4, { name = "", amountRequired = 0 } = {}): Requirement[] {
  return Array.from({ length: count }, () => ({ name, amountRequired }));
}
