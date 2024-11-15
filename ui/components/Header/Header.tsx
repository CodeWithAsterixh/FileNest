"use client";
import { RootState } from "@/store/store";
// components/Header.tsx
import { AppBar, Box, TextField, Toolbar, Typography } from "@mui/material";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";

const Header = () => {
  const { mode } = useSelector((s: RootState) => s.ThemePreference);
  const border = {
    hover: mode === "dark" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
    focus: mode === "dark" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
    default: mode === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
  };
  return (
    <AppBar
      position="sticky"
      className="!z-[1] !bg-neutral-100 dark:!bg-neutral-900"
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
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: border.default,
                },
                "&:hover fieldset": {
                  borderColor: border.hover,
                },
                "&.Mui-focused fieldset": {
                  borderColor: border.focus,
                },
              },
              "& .MuiInputBase-input": {
                color: border.focus, // Light theme text color
              },
              "& .MuiOutlinedInput-root.Mui-focused": {
                color: border.default, // Focused text color (optional)
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
