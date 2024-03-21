import { toast } from "react-toastify";
import React from "react";
import { UserData } from "../pages/Profile";
import SERVER_URL from "../config"
export const editImage = async (
  user: UserData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  selectedImage: File | null
): Promise<string | undefined> => {
  const formData = new FormData();
  formData.append("file", selectedImage);
  const response = await fetch(
    `${SERVER_URL}/user/picture/${user._id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: formData,
    }
  );


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

  localStorage.setItem(
    "user",
    JSON.stringify({
      ...user,
      profileImage: data.profileImage,
    })
  );

  return data.profileImage;
};
