import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "./components/layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { loadMetaFiles } from "./utils/loadMeta";

export default function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    loadMetaFiles(dispatch).finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) return <div>Loading metadata...</div>;

  return (
    <>
      <Navbar />
      <AppRoutes />
    </>
  );
}
