import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    // Implementing SERVER SIDE filtering & sorting
    // 1. FILTER
    const filterValue = searchParams.get("status") || "all";
    const filter =
        !filterValue || filterValue === "all"
            ? null
            : { field: "status", value: filterValue, method: "eq" };

    // 2. SORT
    const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
    const [field, direction] = sortByRaw.split("-");
    const sortBy = { field, direction };

    // 3. PAGINATION
    const page = Number(searchParams.get("page")) || 1;

    // QUERY
    const {
        isPending,
        data: { data: bookings, count: totalResults } = {},
        error,
    } = useQuery({
        queryKey: ["bookings", filter, sortBy, page],
        queryFn: () => getBookings({ filter, sortBy, page }),
    });

    // PRE-FETCHING
    const pageCount = Math.ceil(totalResults / PAGE_SIZE);
    if (page < pageCount) {
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page + 1],
            queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
        });
    }
    if (page > 1) {
        queryClient.prefetchQuery({
            queryKey: ["bookings", filter, sortBy, page - 1],
            queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
        });
    }

    return { isPending, bookings, error, totalResults };
}
