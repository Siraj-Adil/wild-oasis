import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCheckout() {
    const queryClient = useQueryClient();

    const {
        mutate: checkoutMutate,
        isPending: isCheckingOut,
        error: checkoutError,
    } = useMutation({
        mutationFn: (bookingId) =>
            updateBooking(bookingId, {
                status: "checked-out",
            }),
        onSuccess: (data) => {
            // this "data" is what actually returned by mutationFn updateBooking from apiBookings
            toast.success(`Booking #${data.id} successfully checked out`);
            queryClient.invalidateQueries({
                active: true, // This will invalidate all the queries active on the page
            });
        },
        onError: () => {
            toast.error("There was an error while checking out");
        },
    });

    return { checkoutMutate, isCheckingOut, checkoutError };
}
