import { Avatar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";

interface UserAvatarProps {
    username: string | null;
    avatarUrl: string | null;
    sx?: SxProps<Theme>;
}

const defaultSx: SxProps<Theme> = {
    width: 32,
    height: 32,
    display: "inline-flex",
    mr: 1,
    verticalAlign: "middle",
};

export default function UserAvatar({
    username,
    avatarUrl,
    sx = defaultSx,
}: UserAvatarProps) {
    return (
        <Avatar
            src={avatarUrl ?? undefined}
            alt={username ?? undefined}
            sx={sx}
        >
            {(username ?? "?").charAt(0).toUpperCase()}
        </Avatar>
    );
}
