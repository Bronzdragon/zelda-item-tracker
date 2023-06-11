import styles from "./SwalMessages.module.css";

interface Requirement {
  name: string;
  needed: number;
  owned: number;
}

interface UnmetRequirementsProps {
  requirements: Requirement[];
}

export function UnmetRequirements({ requirements }: UnmetRequirementsProps) {
  return (
    <div className={styles.container}>
      <span className={styles.header}>Missing requirements:</span>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Owned</th>
            <th>Needed</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map(({ name, owned, needed }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{owned}</td>
              <td>{needed}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <span className={styles.message}>Add missing items?</span>
    </div>
  );
}

interface ConfirmMessageProps {
  requirements: Requirement[];
}
export function ConfirmMessage({ requirements }: ConfirmMessageProps) {
  return (
    <div className={styles.container}>
      <span className={styles.message}>Do you wish to complete this set? It will have the following effects:</span>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Old total</th>
            <th></th>
            <th>New total</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map(({ name, owned, needed }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{owned}</td>
              <td>⭢</td>
              <td>{Math.max(owned - needed, 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
