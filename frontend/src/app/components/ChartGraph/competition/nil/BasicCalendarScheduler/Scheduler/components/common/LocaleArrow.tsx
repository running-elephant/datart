import { useAppState } from "../../hooks/useAppState";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { IconButton } from "@mui/material";
import { MouseEvent } from "react";

interface LocaleArrowProps {
  type: "prev" | "next";
  onClick?(e?: MouseEvent): void;
}
const LocaleArrow = ({ type, onClick }: LocaleArrowProps) => {
  const { direction } = useAppState();

  let Arrow = NavigateNextRoundedIcon;
  if (type === "prev") {
    Arrow =
      direction === "rtl" ? NavigateNextRoundedIcon : NavigateBeforeRoundedIcon;
  } else if (type === "next") {
    Arrow =
      direction === "rtl" ? NavigateBeforeRoundedIcon : NavigateNextRoundedIcon;
  }

  return (
    <IconButton
      style={{ padding: 2 }}
      onClick={onClick}
      onDragOver={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick();
        }
      }}
    >
      <Arrow />
    </IconButton>
  );
};

export { LocaleArrow };
