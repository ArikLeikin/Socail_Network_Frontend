import { toast } from "react-toastify";
import React from "react";
import { UserData } from "../pages/Profile";

export const editPassword = async (
  user: UserData,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  currentPassword: string,
  newPassword: string
): Promise<string | undefined> => {
  console.log("Edit Password");
  console.log("edit-password newPassword", newPassword);
  console.log("edit-password currentPassword", currentPassword);
  const response = await fetch(
    `http://localhost:3000/user/password/${user._id}`,
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

  console.log("-----------response---------", response);

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
