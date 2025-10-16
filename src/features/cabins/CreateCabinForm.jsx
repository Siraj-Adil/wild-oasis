import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
    const { id: editId, ...editValues } = cabinToEdit;
    const isEditSession = Boolean(editId);
    // console.log(editId, editValues, isEditSession);

    const { register, handleSubmit, getValues, formState, reset } = useForm({
        defaultValues: isEditSession ? editValues : {},
    });
    const { isCreating, createCabinMutate } = useCreateCabin();
    const { isEditing, editCabinMutate } = useEditCabin();
    const { errors } = formState;
    const isWorking = isCreating || isEditing;

    function onSubmit(data) {
        console.log(data);
        const image =
            typeof data.image === "string" ? data.image : data.image[0];

        if (isEditSession) {
            editCabinMutate(
                // This "mutate" function will call "mutationFn" internally with parameters passed and we can pass "onSubmit" handler also
                {
                    newCabinData: { ...data, image: image },
                    id: editId,
                },
                {
                    onSuccess: (data) => {
                        data;
                        reset(); // "reset" function from "useForm" hook
                        onCloseModal?.(); // if "CreateCabinForm" is used outside of Modal, then it may not recieve this prop
                    }, // This "data" is what returned from "mutationFn" ie from API
                }
            );
        } else {
            createCabinMutate(
                { ...data, image: image },
                {
                    onSuccess: (data) => {
                        data;
                        reset(); // "reset" function from "useForm" hook
                        onCloseModal?.(); // if "CreateCabinForm" is used outside of Modal, then it may not recieve this prop
                    }, // This "data" is what returned from "mutationFn" ie from API
                }
            );
        }
    }

    function onError(errors) {
        console.log(errors);
    }

    return (
        <Form
            onSubmit={handleSubmit(onSubmit, onError)}
            type={onCloseModal ? "modal" : "regular"}
        >
            <FormRow label="Cabin name" error={errors?.name?.message}>
                <Input
                    type="text"
                    id="name"
                    disabled={isWorking}
                    {...register("name", {
                        required: "Name field is required",
                    })}
                />
            </FormRow>

            <FormRow
                label="Maximum capacity"
                error={errors?.maxCapacity?.message}
            >
                <Input
                    type="number"
                    id="maxCapacity"
                    disabled={isWorking}
                    {...register("maxCapacity", {
                        required: "Maximum capacity field is required",
                        min: {
                            value: 1,
                            message: "Capacity should be at least 1",
                        },
                    })}
                />
            </FormRow>

            <FormRow
                label="Regular price"
                error={errors?.regularPrice?.message}
            >
                <Input
                    type="number"
                    id="regularPrice"
                    disabled={isWorking}
                    {...register("regularPrice", {
                        required: "Regular price field is required",
                        min: {
                            value: 100,
                            message: "Regular price should be at least 100",
                        },
                    })}
                />
            </FormRow>

            <FormRow label="Discount" error={errors?.discount?.message}>
                <Input
                    type="number"
                    id="discount"
                    disabled={isWorking}
                    defaultValue={0}
                    {...register("discount", {
                        required: "Discount field is required",
                        validate: (value) =>
                            Number(value) <= Number(getValues().regularPrice) ||
                            "Discount should be less than or equal to regular price",
                    })}
                />
            </FormRow>

            <FormRow
                label="Description for website"
                error={errors?.description?.message}
            >
                <Textarea
                    type="number"
                    id="description"
                    disabled={isWorking}
                    defaultValue=""
                    {...register("description", {
                        required: "Description field is required",
                    })}
                />
            </FormRow>

            <FormRow label="Cabin photo" error={errors?.image?.message}>
                <FileInput
                    id="image"
                    disabled={isWorking}
                    accept="image/*"
                    {...register("image", {
                        required: isEditSession
                            ? false
                            : "Image field is required",
                    })}
                />
            </FormRow>

            <FormRow>
                {/* type is an HTML attribute! */}
                <Button
                    variation="secondary"
                    type="reset"
                    onClick={() => onCloseModal?.()}
                >
                    Cancel
                </Button>
                <Button disabled={isWorking}>
                    {isEditSession ? "Edit cabin" : "Create new cabin"}
                </Button>
            </FormRow>
        </Form>
    );
}

export default CreateCabinForm;
