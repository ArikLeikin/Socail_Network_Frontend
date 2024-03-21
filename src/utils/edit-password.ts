import { toast } from "react-toastify";
import React from "react";
import { UserData } from "../pages/Profile";
import SERVER_URL from "../config"
export const editPassword = async (
  user: UserData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  currentPassword: string,
  newPassword: string
): Promise<string | undefined> => {
  const response = await fetch(
    `${SERVER_URL}/user/password/${user._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify({
        password: currentPassword,
        newPassword: newPassword,
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      toast.error("Unauthorized");
    } else if (response.status === 403) {
      toast.error("invalid access token");
    } else if (response.status === 404) {
      toast.error("User not found");
    } else if (response.status === 500) {
      toast.error("Server error");
    }
    setLoading(false);
    return;
  } else {
    toast.success("Password updated successfully");
    setLoading(false);
    return newPassword;
  }
};
