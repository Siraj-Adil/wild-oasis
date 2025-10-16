import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "./useBooking";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import {
    HiArrowDownOnSquare,
    HiArrowUpOnSquare,
    HiTrash,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "./useDeleteBooking";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Empty from "../../ui/Empty";

const HeadingGroup = styled.div`
    display: flex;
    gap: 2.4rem;
    align-items: center;
`;

function BookingDetail() {
    const { isPending, booking, error } = useBooking();
    const { checkoutMutate, isCheckingOut } = useCheckout();
    const { deleteBookingMutate, isDeletingBooking } = useDeleteBooking();
    const moveBack = useMoveBack();
    const navigate = useNavigate();

    if (isPending || isCheckingOut || isDeletingBooking) return <Spinner />;
    if (!booking) return <Empty resourceName="booking" />;
    if (error) toast.error(error.message);

    const { status, id: bookingId } = booking;
    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };

    return (
        <>
            <Row type="horizontal">
                <HeadingGroup>
                    <Heading as="h1">Booking #{bookingId}</Heading>
                    <Tag type={statusToTagName[status]}>
                        {status.replace("-", " ")}
                    </Tag>
                </HeadingGroup>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            <ButtonGroup>
                {status === "unconfirmed" && (
                    <Button
                        icon={<HiArrowDownOnSquare />}
                        onClick={() => navigate(`/checkin/${bookingId}`)}
                    >
                        Check in
                    </Button>
                )}
                {status === "checked-in" && (
                    <Button
                        icon={<HiArrowUpOnSquare />}
                        onClick={() => checkoutMutate(bookingId)}
                        disabled={isCheckingOut}
                    >
                        Check out
                    </Button>
                )}
                <Modal>
                    <Modal.Open opens="delete-booking-form">
                        <Button variation="danger" icon={<HiTrash />}>
                            Delete booking
                        </Button>
                    </Modal.Open>
                    <Modal.Window name="delete-booking-form">
                        <ConfirmDelete
                            resourceName="booking"
                            onConfirm={() =>
                                deleteBookingMutate(bookingId, {
                                    onSettled: () => {
                                        navigate(-1);
                                    },
                                })
                            }
                            disabled={isDeletingBooking}
                        />
                    </Modal.Window>
                </Modal>
                <Button variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    );
}

export default BookingDetail;
