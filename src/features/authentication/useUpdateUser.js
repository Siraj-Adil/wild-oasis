import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser() {
    const queryClient = useQueryClient();

    const {
        mutate: updateUserMutate,
        isPending: isUpdating,
        error: updatingError,
    } = useMutation({
        mutationFn: (updateObject) => updateCurrentUser(updateObject),
        onSuccess: () => {
            toast.success("User account successfully updated");
            queryClient.invalidateQueries({
                queryKey: ["user"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    return { isUpdating, updateUserMutate, updatingError };
}
