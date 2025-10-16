import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
    const {
        isPending: isLoadingUser,
        data: user,
        error: userError,
    } = useQuery({
        queryFn: getCurrentUser,
        queryKey: ["user"],
    });
    return {
        isLoadingUser,
        user,
        isAuthenticated: user?.role === "authenticated",
        userError,
    };
}
