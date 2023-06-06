import { useState, PropsWithChildren } from "react";
import styles from "./Collapsible.module.css";

function Collapsible({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div>
      <span className={styles.line} onClick={() => setCollapsed((v) => !v)}>
        {collapsed ? "−" : "+"}
      </span>
      <section className={styles.inset}>{!collapsed && children}</section>
    </div>
  );
}

export default Collapsible;
