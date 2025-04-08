import apiRequest from "./apiRequest";
import { defer } from "react-router-dom";

export const singlePageLoader = async ({ request, params }) => {
  const postPromise = apiRequest("/posts/" + params.id)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error loading post:", error);
      throw error;
    });

  return defer({
    post: postPromise,
  });
};

export const listPageLoader = async ({ request }) => {
  const query = request.url.split("?")[1];

  const postPromise = apiRequest("/posts?" + query).then((res) => res.data);
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  return defer({
    postResponse: postPromise,
  });
};
