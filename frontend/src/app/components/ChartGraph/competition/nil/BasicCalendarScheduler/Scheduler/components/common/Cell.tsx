import { Button } from "@mui/material";

interface CellProps {
  start: Date;
  end: Date;
  resourceKey: string;
  resourceVal: string | number;
  children?: JSX.Element;
}

const Cell = ({
  start,
  end,
  resourceKey,
  resourceVal,
  children,
}: CellProps) => {
  return (
    <Button
      fullWidth
    >
      {children}
    </Button>
  );
};

export { Cell };
