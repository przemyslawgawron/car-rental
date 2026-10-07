import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
    Button,
    Stack,
    Typography,
} from "@mui/material";

type AvailabilitySearchInfoProps = {
    message: string;
    onClose: () => void;
};

function AvailabilitySearchInfo({
                                    message,
                                    onClose,
                                }: AvailabilitySearchInfoProps) {
    return (
        <Stack
            spacing={3}
            sx={{
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <InfoOutlinedIcon
                color="info"
                sx={{
                    fontSize: 48,
                }}
            />

            <Typography
                variant="h5"
                component="h2"
                sx={{
                    textAlign: "center",
                }}
            >
                No Vehicles Available
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    textAlign: "center",
                }}
            >
                {message}
            </Typography>

            <Button
                variant="outlined"
                onClick={onClose}
            >
                Back
            </Button>
        </Stack>
    );
}

export default AvailabilitySearchInfo;