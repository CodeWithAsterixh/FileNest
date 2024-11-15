"use client";

import { setSideBarSize } from "@/store/reducers/sidebar";
import { setTheme } from "@/store/reducers/theme";
import { AppDispatch, RootState } from "@/store/store";
import { Button, IconButton } from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useCallback } from "react";
import { AiFillHome } from "react-icons/ai";
import { BsMoon, BsStar, BsSun } from "react-icons/bs";
import { FaFolder } from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { MdAccountCircle, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

type Props = object;
type NavBarLinkProps = {
  path: string;
  text: string;
  icon?: React.ReactNode;
  title?: string;
};

function NavBarLink({ path, text, icon, title }: NavBarLinkProps) {
  const { size } = useSelector((s: RootState) => s.SideBar);
  const pathUrl = usePathname();

  return (
    <Link href={path} className={"w-full"} title={title}>
      <Button
        className={clsx("w-full  ", {
          "!px-0 !py-3 *:!m-0 !min-w-fit": size === "small",
          "!p-2": size === "full",
          "!bg-black/70 dark:!bg-white/70 !text-base-white dark:!text-black":
            path === pathUrl,
          "!bg-black/20 dark:!bg-white/20 !text-base-black dark:!text-white":
            path !== pathUrl,
        })}
        startIcon={
          <i className="text-sm min-[498px]:text-lg sm:text-xl">
            {icon ? icon : <AiFillHome />}
          </i>
        }
      >
        {size === "full" && (
          <strong className="size-full text-left text-sm min-[498px]:text-lg">
            {text}
          </strong>
        )}
      </Button>
    </Link>
  );
}
function NavBar({}: Props) {
  const { size } = useSelector((s: RootState) => s.SideBar);
  const { mode } = useSelector((s: RootState) => s.ThemePreference);
  const dispatch = useDispatch<AppDispatch>();
  //   sidebar toggler
  const handleToggleSideBarSize = useCallback(() => {
    if (size === "full") {
      dispatch(setSideBarSize("small"));
    } else {
      dispatch(setSideBarSize("full"));
    }
  }, [dispatch, size]);
  const handleToggleTheme = useCallback(() => {
    if (mode === "dark") {
      dispatch(setTheme("light"));
    } else {
      dispatch(setTheme("dark"));
    }
  }, [dispatch, mode]);
  const navigation = [
    { label: "Home", icon: <AiFillHome /> },
    { label: "Recent", icon: <FaFolder /> },
    { label: "Favorites", icon: <BsStar /> },
    { label: "Trash", icon: <MdDelete /> },
  ];
  return (
    <aside
      className={clsx(
        "fixed top-0 left-0 sm:relative z-10 sm:h-full duration-200 p-0",
        {
          "w-[40vw] max-w-[300px] min-w-fit h-full": size === "full",
          "w-16 h-fit": size === "small",
        }
      )}
    >
      {/* sidebar content */}
      <section
        className={clsx(
          "w-full p-2 relative flex flex-col items-start justify-start gap-2 min-w-fit sm:h-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden",
          {
            "h-fit": size === "small",
            "h-full": size === "full",
          }
        )}
      >
        {/* topbar of the  sidebar */}
        <div
          className={clsx(
            "w-full p-2 border-b-4 border-b-black/20 dark:border-b-white/20 flex flex-col items-center gap-10",
            {
              "justify-center": size === "small",
              "justify-between": size === "full",
            }
          )}
        >
          <div
            className={clsx(
              "flex items-center justify-end",
              size === "full" ? "w-full" : "w-fit"
            )}
          >
            <button
              onClick={handleToggleSideBarSize}
              className="text-xl sm:text-2xl text-black dark:text-white"
            >
              {size === "full" ? <GoSidebarExpand /> : <GoSidebarCollapse />}
            </button>
          </div>
          {size === "full" && (
            <div className="w-full min-w-40 h-fit flex items-center justify-center">
              <IconButton
                className="text-black size-36 dark:text-white"
                color="inherit"
              >
                <MdAccountCircle className="size-full" />
              </IconButton>
            </div>
          )}
        </div>
        <nav
          className={clsx(
            "sm:flex w-full flex-col items-start justify-start gap-3",
            {
              "p-0 hidden": size === "small",
              "p-2 flex": size === "full",
            }
          )}
        >
          {navigation.map((item, index) => (
            <NavBarLink
              key={index}
              path="/"
              text={item.label}
              icon={item.icon}
              title={`Go to ${item.label}`}
            />
          ))}
        </nav>

        {/* theme changer */}
        <div
          className={clsx(
            "sm:flex absolute bottom-0 left-1/2 w-[calc(100%-0.5rem)] p-2 -translate-x-1/2 flex-col items-start justify-start gap-3",
            {
              "w-[calc(100%-0.25rem)] p-1 hidden": size === "small",
              "w-[calc(100%-0.5rem)] p-2 flex": size === "full",
            }
          )}
        >
          <Button
            className={clsx(
              "w-full !bg-black/20 dark:!bg-white/20 !text-base-black dark:!text-white",
              {
                "!px-0 !py-3 *:!m-0 !min-w-fit": size === "small",
                "!p-2": size === "full",
              }
            )}
            startIcon={
              <i className="text-sm min-[498px]:text-lg sm:text-xl">
                {mode === "dark" ? <BsMoon /> : <BsSun />}
              </i>
            }
            onClick={handleToggleTheme}
          >
            {size === "full" && (
              <strong className="size-full text-left text-sm min-[498px]:text-lg">
                {mode === "dark" ? "Light" : "Dark"} Theme
              </strong>
            )}
          </Button>
        </div>
      </section>
    </aside>
  );
}

export default NavBar;
