import { useState } from "react";
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
  const [requirements, setRequirements] = useState<Requirement[]>(
    () => details?.requirements ?? getDefaultRequirements()
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (name === "") return;

        onSubmit?.({ name, requirements });
        setName("");
        setRequirements(getDefaultRequirements());
      }}
    >
      <label htmlFor="name" className={styles.label}>
        Name
      </label>
      <input
        type="text"
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Armour piece..."
      ></input>

      <div className={styles.label}>Requirements:</div>
      <table>
        <thead>
          <th></th>
          <th>name</th>
          <th>count</th>
          <th></th>
        </thead>
        <tbody>
          {requirements.map((requirement, index) => (
            <RequirementInput
              value={requirement}
              onChange={(newValue) => {
                if (!newValue.name) newValue.amount = 0;
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

function RequirementInput({
  value: { name, amount },
  onChange,
}: RequirementInputProps) {
  // console.log("Creating requirements field... current value: ", name, amount);

  return (
    <tr>
      <td>
        <input
          type="text"
          name={`item`}
          value={name}
          placeholder="Material..."
          onChange={(event) => onChange({ name: event.target.value, amount })}
        ></input>
      </td>
      <td>
        <input
          type="number"
          min={0}
          step={1}
          name={`amount`}
          className={styles["number-input"]}
          value={amount}
          onChange={(event) =>
            onChange({ name, amount: Number(event.target.value) })
          }
        ></input>
      </td>
    </tr>
  );
}

// function assertIsHTMLFormElement(
//   e: EventTarget | null
// ): asserts e is HTMLFormElement {
//   if (!(e instanceof HTMLFormElement)) {
//     throw new TypeError("Not a form element!");
//   }
// }

// function zip<T>(...arrays: T[][]): T[][] {
//   const length = Math.max(...arrays.map((arr) => arr.length));
//   return Array.from({ length }, (_, i) => arrays.map((arr) => arr[i]));
// }

function getDefaultRequirements(count = 4, { name = "", amount = 0 } = {}) {
  return Array.from({ length: count }, () => ({ name, amount }));
}
