///src/App.jsx//////

import { useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import Navbar from "./components/layout/Navbar";
import { store } from "./redux/store";
import AppRoutes from "./routes/AppRoutes";
import { nftContract } from "./utils/contractSetup";
import { loadMetaFiles } from "./utils/loadMeta"; // Import the function

export default function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    loadMetaFiles(dispatch, nftContract); // Dispatch meta files loading
  }, [dispatch, nftContract]);

  return (
    <Provider store={store}>
      <Navbar />
      <AppRoutes />
    </Provider>
  );
}
