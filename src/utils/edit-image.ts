import { toast } from "react-toastify";
import React from "react";
import { UserData } from "../pages/Profile";

export const editImage = async (
  user: UserData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  selectedImage: File | null
): Promise<string | undefined> => {
  console.log("Edit Image");
  console.log("user", user);
  const formData = new FormData();
  formData.append("file", selectedImage);
  const response = await fetch(
    `http://localhost:3000/user/picture/${user._id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: formData,
    }
  );
  console.log("-----------response---------", response);

  if (!response.ok) {
    if (response.status === 401) {
      toast.error("Unauthorized");
    } else if (response.status === 403) {
      toast.error("invalid access token");
    } else if (response.status === 404) {
      toast.error("User not found");
    } else if (response.status === 415) {
      toast.error("Unsupported media type");
    } else if (response.status === 500) {
      toast.error("Server error");
    }
    setLoading(false);
    return;
  }
  const data = await response.json();
  console.log("-----------data---------", data);

  localStorage.setItem(
    "user",
    JSON.stringify({
      ...user,
      profileImage: data.profileImage,
    })
  );

  return data.profileImage;
};
