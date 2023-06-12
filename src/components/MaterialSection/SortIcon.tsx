import sortAscendingImage from "./sort-ascending.svg";
import sortDescendingImage from "./sort-descending.svg";
import { SortState } from "./MaterialSection";

interface SortIconProps {
  state: SortState;
  name: string;
}
function SortIcon({ state, name }: SortIconProps) {
  return (
    <img
      src={state.sortedBy === name && state.direction === "asc" ? sortAscendingImage : sortDescendingImage}
      alt={`sort by ${name}`}
    />
  );
}

export default SortIcon;
