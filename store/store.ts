import { configureStore } from "@reduxjs/toolkit";
import { UserThemePreferences } from "./reducers/theme";
import { SideBarPreference } from "./reducers/sidebar";
import File from "./reducers/fileState";

const store = configureStore({
  reducer: {
    ThemePreference: UserThemePreferences,
    SideBar: SideBarPreference,
    files: File,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
