import { useDeleteCabin } from "./useDeleteCabin";
import { useCreateCabin } from "./useCreateCabin";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";
import styled from "styled-components";
import CreateCabinForm from "./CreateCabinForm";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Modal from "../../ui/Modal";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

// const TableRow = styled.div`
//     display: grid;
//     grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
//     column-gap: 2.4rem;
//     align-items: center;
//     padding: 1.4rem 2.4rem;

//     &:not(:last-child) {
//         border-bottom: 1px solid var(--color-grey-100);
//     }
// `;

const Img = styled.img`
    display: block;
    width: 6.4rem;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    object-position: center;
    transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--color-grey-600);
    font-family: "Sono";
`;

const Price = styled.div`
    font-family: "Sono";
    font-weight: 600;
`;

const Discount = styled.div`
    font-family: "Sono";
    font-weight: 500;
    color: var(--color-green-700);
`;

function CabinRow({ cabin }) {
    const { isDeleting, deleteCabinMutate } = useDeleteCabin();
    const { isCreating: isDuplicating, createCabinMutate } = useCreateCabin();
    const {
        id: cabinId,
        name,
        maxCapacity,
        regularPrice,
        discount,
        description,
        image,
    } = cabin;

    function handleDuplicate() {
        createCabinMutate({
            name: `Copy of ${name}`,
            maxCapacity,
            regularPrice,
            discount,
            description,
            image,
        });
    }

    return (
        <Table.Row role="row">
            <Img src={image} />
            <Cabin>{name}</Cabin>
            <div>Fits upto {maxCapacity} peoples</div>
            <Price>{formatCurrency(regularPrice)}</Price>
            {discount ? (
                <Discount>{formatCurrency(discount)}</Discount>
            ) : (
                <span>&mdash;</span>
            )}
            <div>
                <button disabled={isDuplicating} onClick={handleDuplicate}>
                    <HiSquare2Stack />
                </button>
                <Modal>
                    <Modal.Open opens="edit-cabin-form">
                        <button>
                            <HiPencil />
                        </button>
                    </Modal.Open>
                    <Modal.Window name="edit-cabin-form">
                        <CreateCabinForm cabinToEdit={cabin} />
                    </Modal.Window>
                    <Modal.Open opens="delete-form">
                        <button>
                            <HiTrash />
                        </button>
                    </Modal.Open>
                    <Modal.Window name="delete-form">
                        <ConfirmDelete
                            resourceName="cabin"
                            onConfirm={() => deleteCabinMutate(cabinId)}
                            disabled={isDeleting}
                        />
                    </Modal.Window>
                </Modal>
            </div>
        </Table.Row>
    );
}

export default CabinRow;
