import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { RouterProvider, createBrowserRouter, defer, Outlet } from "react-router-dom";
import ChatPage from "./components/ChatPage";
import HomePage from "./components/HomePage";
import SourcesPage from "./components/SourcesPage";
import { Link } from "./models/link.js";

let linksPromise;

function loadLinksOnce() {
  if (!linksPromise) {
    linksPromise = Link.loadAll();
  }
  return linksPromise;
}

function linksRootLoader() {
  return defer({
    links: loadLinksOnce(),
  });
}

const router = createBrowserRouter([
  {
    path: "/",
    id: "root",
    loader: linksRootLoader,
    element: <Outlet />,
    children: [
      {
        path: "sources/*",
        element: <SourcesPage />,
      },
      {
        path: ":app/sources/*",
        element: <SourcesPage />,
      },
      {
        path: "_chat",
        element: <ChatPage />,
      },
      {
        path: ":app/_chat",
        element: <ChatPage />,
      },
      {
        path: "tags/*",
        element: <HomePage />,
      },
      {
        path: ":app/tags/*",
        element: <HomePage />,
      },
      {
        path: ":app",
        element: <HomePage />,
      },
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);

const theme = createTheme({
  typography: {
    fontSize: 16,
  },
  palette: {
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
