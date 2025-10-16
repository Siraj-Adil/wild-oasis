import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        mutate: checkinMutate,
        isPending: isCheckingIn,
        error: checkinError,
    } = useMutation({
        mutationFn: ({ bookingId, breakfast }) =>
            updateBooking(bookingId, {
                status: "checked-in",
                isPaid: true,
                ...breakfast,
            }),
        onSuccess: (data) => {
            // this "data" is what actually returned by mutationFn updateBooking from apiBookings
            toast.success(`Booking #${data.id} successfully checked in`);
            queryClient.invalidateQueries({
                active: true, // This will invalidate all the queries active on the page
            });
            navigate("/");
        },
        onError: () => {
            toast.error("There was an error while checking in");
        },
    });

    return { checkinMutate, isCheckingIn, checkinError };
}
