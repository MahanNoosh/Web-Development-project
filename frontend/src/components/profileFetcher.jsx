import { useEffect } from "react";
import { useProfile } from "@/store/profile";

const ProfileFetcher = () => {
  const { loggedinUser, fetchProfile } = useProfile();

  useEffect(() => {
    if (!loggedinUser) {
      fetchProfile();
    }
  }, [loggedinUser, fetchProfile]);

  return null;
};

export default ProfileFetcher;
