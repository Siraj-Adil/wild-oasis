import {
    HiOutlineBanknotes,
    HiOutlineBriefcase,
    HiOutlineCalendarDays,
    HiOutlineChartBar,
} from "react-icons/hi2";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
    // Calculating all the statistics
    // 1. No. of bookings
    const numBookings = bookings.length;

    // 2. Total sales
    const totalSales = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);

    // 3. Total checkins
    const totalCheckins = confirmedStays.length;

    // 4. Occupancy rate = (No. of checked-in nights) / (Total available nights of all cabins)
    const noCheckedInNights = confirmedStays.reduce(
        (acc, curr) => acc + curr.numNights,
        0
    );
    const occupancyRate = noCheckedInNights / (numDays * cabinCount);

    return (
        <>
            <Stat
                title={"Bookings"}
                icon={<HiOutlineBriefcase />}
                value={numBookings}
                color={"blue"}
            />
            <Stat
                title={"Sales"}
                icon={<HiOutlineBanknotes />}
                value={formatCurrency(totalSales)}
                color={"green"}
            />
            <Stat
                title={"Check ins"}
                icon={<HiOutlineCalendarDays />}
                value={totalCheckins}
                color={"indigo"}
            />
            <Stat
                title={"Occupancy rate"}
                icon={<HiOutlineChartBar />}
                value={Math.round(occupancyRate * 100) + "%"}
                color={"yellow"}
            />
        </>
    );
}

export default Stats;
