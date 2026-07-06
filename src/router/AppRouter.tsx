import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../layouts/AppLayout";
import { About } from "../pages/About/About";
import { Album } from "../pages/Album/Album";
import { Favorites } from "../pages/Favorites/Favorites";
import { Home } from "../pages/Home/Home";
import { NotFound } from "../pages/NotFound/NotFound";
import { Search } from "../pages/Search/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "favorites", element: <Favorites /> },
      { path: "about", element: <About /> },
      { path: "album/:albumId", element: <Album /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
