import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

export function useSettings() {
    const {
        isPending: isLoadingSettings,
        data: settings,
        error,
    } = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    });

    return { isLoadingSettings, settings, error };
}
