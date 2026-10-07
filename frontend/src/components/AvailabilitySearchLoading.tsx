import {
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

type AvailabilitySearchLoadingProps = {
    onCancel: () => void;
};

function AvailabilitySearchLoading({ onCancel }: AvailabilitySearchLoadingProps) {
    return (
        <Stack
            spacing={3}
            sx={{
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <CircularProgress />

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                    textAlign: "center",
                }}
            >
                Checking availability...
            </Typography>

            <Button
                variant="outlined"
                onClick={onCancel}
            >
                Cancel
            </Button>
        </Stack>
    );
}

export default AvailabilitySearchLoading;