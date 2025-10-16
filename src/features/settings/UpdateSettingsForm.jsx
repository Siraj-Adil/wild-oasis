import { useSettings } from "./useSettings";
import { useUpdateSettings } from "./useUpdateSetting";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";

function UpdateSettingsForm() {
    const {
        isLoading,
        settings: {
            minBookingLength,
            maxBookingLength,
            maxGuestsPerBooking,
            breakfastPrice,
        } = {}, // This means when "settings" is undefined, then we are setting it to {}
        error,
    } = useSettings();
    const { isUpdating, updateSetttingMutate } = useUpdateSettings();

    function handleUpdate(evt, field) {
        const value = evt.target.value;
        if (!value) return;
        updateSetttingMutate({ [field]: value });
    }

    if (isLoading) return <Spinner />;
    if (error) console.log(error);

    return (
        <Form>
            <FormRow label="Minimum nights/booking">
                <Input
                    type="number"
                    id="min-nights"
                    disabled={isUpdating}
                    defaultValue={minBookingLength}
                    onBlur={(evt) => handleUpdate(evt, "minBookingLength")}
                />
            </FormRow>

            <FormRow label="Maximum nights/booking">
                <Input
                    type="number"
                    id="max-nights"
                    disabled={isUpdating}
                    defaultValue={maxBookingLength}
                    onBlur={(evt) => handleUpdate(evt, "maxBookingLength")}
                />
            </FormRow>

            <FormRow label="Maximum guests/booking">
                <Input
                    type="number"
                    id="max-guests"
                    disabled={isUpdating}
                    defaultValue={maxGuestsPerBooking}
                    onBlur={(evt) => handleUpdate(evt, "maxGuestsPerBooking")}
                />
            </FormRow>

            <FormRow label="Breakfast price">
                <Input
                    type="number"
                    id="breakfast-price"
                    disabled={isUpdating}
                    defaultValue={breakfastPrice}
                    onBlur={(evt) => handleUpdate(evt, "breakfastPrice")}
                />
            </FormRow>
        </Form>
    );
}

export default UpdateSettingsForm;
