import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useLogin() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        mutate: loginMutate,
        isPending: isLogginIn,
        error: errorLogin,
    } = useMutation({
        mutationFn: ({ email, password }) => login({ email, password }),
        onSuccess: (data) => {
            // Manually setting data in react query cache, so that immediately after logging in
            // "useUser" hook need not to get current user from supabase, it can load it directly
            // from react query cache
            queryClient.setQueryData(["user"], data.user);
            toast.success("User successfully logged in");
            navigate("/dashboard", { replace: true });
        },
        onError: (err) => {
            console.log("ERROR: ", err);
            toast.error("Provided email or password are incorrect");
        },
    });
    return { loginMutate, isLogginIn, errorLogin };
}
