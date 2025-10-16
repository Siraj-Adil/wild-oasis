import { useCabins } from "./useCabins";
import { useSearchParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";
import CabinRow from "./CabinRow";
import toast from "react-hot-toast";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";

function CabinTable() {
    const { isPending, cabins, error } = useCabins();
    const [searchParams] = useSearchParams();

    if (error) toast.error(error.message);
    if (isPending) return <Spinner />;
    if (!cabins.length) return <Empty resourceName="cabins" />;

    // Implementing CLIENT SIDE filtering & sorting
    // 1. FILTER
    const filterValue = searchParams.get("discount") || "all";

    let filteredCabins;
    if (filterValue === "all") filteredCabins = cabins;
    if (filterValue === "with-discount") {
        filteredCabins = cabins?.filter((cabin) => cabin.discount > 0);
    }
    if (filterValue === "no-discount") {
        filteredCabins = cabins?.filter((cabin) => cabin.discount === 0);
    }

    // 2. SORT
    const sortBy = searchParams.get("sortBy") || "startDate-asc";
    const [field, direction] = sortBy.split("-");
    const sortedCabins = filteredCabins.sort((a, b) =>
        direction === "asc" ? a[field] - b[field] : b[field] - a[field]
    );

    return (
        <Menus>
            <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 2fr">
                <Table.Header role="row">
                    <div></div>
                    <div>Cabin</div>
                    <div>Capacity</div>
                    <div>Price</div>
                    <div>Discount</div>
                    <div></div>
                </Table.Header>
                <Table.Body
                    data={sortedCabins}
                    render={(cabin) => (
                        <CabinRow cabin={cabin} key={cabin.id} />
                    )}
                />
            </Table>
        </Menus>
    );
}

export default CabinTable;
