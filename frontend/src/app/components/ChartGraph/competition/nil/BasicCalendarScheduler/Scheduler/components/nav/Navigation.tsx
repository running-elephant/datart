import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Button, IconButton, MenuItem, MenuList, Popover, useMediaQuery, useTheme
} from "@mui/material";
import { Fragment, useState } from "react";
import { useAppState } from "../../hooks/useAppState";
import { DayDateBtn } from "./DayDateBtn";
import { MonthDateBtn } from "./MonthDateBtn";
import { WeekDateBtn } from "./WeekDateBtn";

export type View = "month" | "week" | "day";
const typeMaps = {
  "today": "今天",
  "month": "月",
  "week": "周",
  "day": "天",
}

const Navigation = () => {
  const { selectedDate, view, week, handleState, getViews } = useAppState();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const views = getViews();

  const toggleMoreMenu = (el?: Element) => {
    setAnchorEl(el || null);
  };

  const renderDateSelector = () => {
    switch (view) {
      case "month":
        return (
          <MonthDateBtn selectedDate={selectedDate} onChange={handleState} />
        );
      case "week":
        return (
          <WeekDateBtn
            selectedDate={selectedDate}
            onChange={handleState}
            weekProps={week!}
          />
        );
      case "day":
        return (
          <DayDateBtn selectedDate={selectedDate} onChange={handleState} />
        );
      default:
        return "";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {renderDateSelector()}
      <div>
        <Button onClick={() => handleState(new Date(), "selectedDate")}>
          今天
        </Button>
        {views.length > 1 &&
          (isDesktop ? (
            views.map((v) => (
              <Button
                key={v}
                color={v === view ? "primary" : "inherit"}
                onClick={() => handleState(v, "view")}
                onDragOver={(e) => {
                  e.preventDefault();
                  handleState(v, "view");
                }}
              >
                {typeMaps[v]}
              </Button>
            ))
          ) : (
            <Fragment>
              <IconButton
                style={{ padding: 5 }}
                onClick={(e) => {
                  toggleMoreMenu(e.currentTarget);
                }}
              >
                <MoreVertIcon />
              </IconButton>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={(e) => {
                  toggleMoreMenu();
                }}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <MenuList autoFocusItem={!!anchorEl} disablePadding>
                  {views.map((v) => (
                    <MenuItem
                      key={v}
                      selected={v === view}
                      onClick={() => {
                        toggleMoreMenu();
                        handleState(v, "view");
                      }}
                    >
                      {v}
                    </MenuItem>
                  ))}
                </MenuList>
              </Popover>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export { Navigation };
