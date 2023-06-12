import styles from "./MaterialSection.module.css";
import type { SortState } from "./MaterialSection";
import SortIcon from "./SortIcon";

type MaterialHeaderProps = {
  name: SortState["sortedBy"];
  sortInfo?: { state: SortState; onSortChanged?: (newState: SortState) => void };
};
function MaterialHeader({ name, sortInfo: sort }: MaterialHeaderProps) {
  return (
    <th
      className={styles.tableHeader}
      onClick={() => {
        if (!sort?.state) return;
        const direction = sort.state.sortedBy === name && sort.state.direction === "asc" ? "dec" : "asc";
        sort?.onSortChanged?.({ sortedBy: name, direction });
      }}
    >
      {name}
      {sort ? <SortIcon state={sort.state} name={name} /> : null}
    </th>
  );
}

export default MaterialHeader;
