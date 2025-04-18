import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import { Layout, RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import ServicesPage from "./routes/servicesPage/servicesPage";
import AgentsPage from "./routes/agentsPage/agentsPage";
import AboutPage from "./routes/aboutPage/aboutPage";
import {
  singlePageLoader,
  listPageLoader,
  profilePageLoader,
} from "./lib/loaders";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/services",
          element: <ServicesPage />,
        },
        {
          path: "/agents",
          element: <AgentsPage />,
        },
        {
          path: "/about",
          element: <AboutPage />,
        },
        {
          element: <RequireAuth />,
          children: [
            {
              path: "/profile",
              element: <ProfilePage />,
              loader: profilePageLoader,
            },
            {
              path: "/profileUpdate",
              element: <ProfileUpdatePage />,
            },
            {
              path: "/add",
              element: <NewPostPage />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
