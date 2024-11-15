// components/Header.tsx
import {
  AppBar,
  Box,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import { BiSearch } from "react-icons/bi";

const Header = () => {
  return (
    <AppBar
      position="sticky"
      className="!z-[1] bg-neutral-100 dark:bg-neutral-900"
    >
      <Toolbar className="flex items-center justify-between gap-2">
        <Typography
          variant="h6"
          className="!w-fit !pl-12 sm:!pl-0 text-black dark:text-white"
        >
          FileNest
        </Typography>
        <Box sx={{ flexGrow: 2, maxWidth: "500px" }}>
          <TextField
            placeholder="Search files..."
            variant="outlined"
            className="*:!border-black dark:*:!border-white *:text-black dark:*:text-white"
            size="small"
            slotProps={{
              input: {
                startAdornment: <BiSearch fontSize="small" />,
              },
            }}
            fullWidth
          />
        </Box>
        
      </Toolbar>
      {/* <LinearProgress variant="determinate" value={75} />{" "} */}
      {/* Example storage indicator */}
    </AppBar>
  );
};

export default Header;
