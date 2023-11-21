import styles from "./AppLayout.module.css";
import Sidebar from "../components/Sidebar";
import Map from "../components/Map";
import ProtectProvider from "../components/ProtectProvider";

function AppLayout() {
  return (
    <div className={styles.app}>
      <ProtectProvider>
        <Sidebar />
        <Map />
      </ProtectProvider>
    </div>
  );
}

export default AppLayout;
