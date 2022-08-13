import { useQuery } from "react-query";

export function useUserData(userId: string) {
  const usersData = useQuery(["users", userId], () =>
    fetch(`/api/users/${userId}`).then((res) => res.json())
  );

  return usersData;
}