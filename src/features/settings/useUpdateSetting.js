import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSetting } from "../../services/apiSettings";
import toast from "react-hot-toast";

export function useUpdateSettings() {
    const queryClient = useQueryClient();

    const {
        mutate: updateSetttingMutate,
        isPending: isUpdating,
        error: updatingError,
    } = useMutation({
        mutationFn: (newSetting) => updateSetting(newSetting),
        onSuccess: () => {
            toast.success("Setting successfully updated");
            queryClient.invalidateQueries({
                queryKey: ["settings"],
            });
        },
        onError: (err) => toast.error(err.message),
    });

    return { isUpdating, updateSetttingMutate, updatingError };
}
