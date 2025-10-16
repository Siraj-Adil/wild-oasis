import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
    const queryClient = useQueryClient();
    const {
        mutate: deleteBookingMutate,
        isPending: isDeletingBooking,
        error: deletingBookingError,
    } = useMutation({
        mutationFn: (bookingId) => deleteBooking(bookingId), // This bookingId is sent from calling deleteBookingMutate(bookingId) function
        onSuccess: () => {
            toast.success(`Booking successfully deleted`);
            queryClient.invalidateQueries({
                queryKey: ["bookings"],
            });
        },
        onError: (err) => {
            console.log(err.message);
            toast.error("There was an error while deleting booking");
        },
    });
    return { deleteBookingMutate, isDeletingBooking, deletingBookingError };
}
