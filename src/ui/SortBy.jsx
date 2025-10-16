import { useSearchParams } from "react-router-dom";
import Select from "./Select";

function SortBy({ options }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBySelected = searchParams.get("sortBy") || options[0].value;
    function handleChange(evt) {
        searchParams.set("sortBy", evt.target.value);
        setSearchParams(searchParams);
    }
    return (
        <Select
            type="white"
            onChange={handleChange}
            currentSelected={sortBySelected}
            options={options}
        ></Select>
    );
}

export default SortBy;
