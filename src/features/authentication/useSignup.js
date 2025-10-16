import { useMutation } from "@tanstack/react-query";
import { signup } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
    const {
        mutate: signupMutate,
        isPending: isSigningIn,
        error: errorSignup,
    } = useMutation({
        mutationFn: (newUser) => signup(newUser),
        onSuccess: (data) => {
            console.log(data);
            toast.success(
                "Account successfully created! Please verify the new account from the user's email address"
            );
        },
        onError: (err) => {
            console.log("ERROR: ", err);
            toast.error("There was an error signing up user");
        },
    });
    return { signupMutate, isSigningIn, errorSignup };
}
