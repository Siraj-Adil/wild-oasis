import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

export function useBooking() {
    const { bookingId } = useParams(); // "bookingId" name should match what we defined in react-router in "App.jsx"
    const {
        isPending,
        data: booking,
        error,
    } = useQuery({
        queryKey: ["bookings", bookingId],
        queryFn: () => getBooking(bookingId),
        retry: false, // By default react query try to fetch data 3 times in case it fails in beginning, we can turn off that feature here
    });

    return { isPending, booking, error };
}
