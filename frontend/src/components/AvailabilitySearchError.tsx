import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import {
    Button,
    List,
    ListItem,
    Stack,
    Typography,
} from "@mui/material";

type AvailabilitySearchErrorProps = {
    messages: string[];
    onClose: () => void;
};

function AvailabilitySearchError({ messages, onClose}: AvailabilitySearchErrorProps) {
    return (
        <Stack
            spacing={3}
            sx={{
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <ErrorOutlinedIcon
                color="error"
                sx={{ fontSize: 48 }}
            />

            <Typography
                variant="h5"
                component="h2"
                color="error"
                sx={{
                    textAlign: "center",
                }}
            >
                Error
            </Typography>

            <List
                disablePadding
                sx={{ width: "100%" }}
            >
                {messages.map((message, index) => (
                    <ListItem
                        key={`${message}-${index}`}
                        sx={{
                            justifyContent: "center",
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {message}
                        </Typography>
                    </ListItem>
                ))}
            </List>

            <Button
                variant="outlined"
                onClick={onClose}
            >
                Close
            </Button>
        </Stack>
    );
}

export default AvailabilitySearchError;