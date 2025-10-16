import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        mutate: logoutMutate,
        isPending: isLogginOut,
        error: errorLogout,
    } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            // Mutation function only removes the current {user object & session object}
            // from browser storage but not from react query, so we need to do it manually
            toast.success("User successfully logged out");
            queryClient.removeQueries();
            navigate("/login", { replace: true });
        },
        onError: (err) => {
            console.log("ERROR: ", err);
            toast.error("There was an error logging out user");
        },
    });
    return { logoutMutate, isLogginOut, errorLogout };
}
