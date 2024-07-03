import DBNavbar from "./dashboard/dashboard_navbar";
import DB from "./dashboard/dashboard";
import "../index.css";

const db = () => {

  return (
      <div className="flex">
        <DBNavbar />
        <main className="grow">
          <DB />
        </main>
      </div>
  );
};

export default db;