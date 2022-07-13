import { useQuery } from "react-query"

export function useUserData(userId: any) {
    const usersData = useQuery(
        ["users", userId],
        () => fetch(`/api/users/${userId}`).then(res => res.json()),
    )

    return usersData
}