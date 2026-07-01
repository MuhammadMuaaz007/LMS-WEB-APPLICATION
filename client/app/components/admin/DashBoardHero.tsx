"use client";
import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardWidgets from "../../components/admin/Widgets/DashboardWidgets";

type Props = {
  isDashboard?: boolean;
};
const DashBoardHero = ({ isDashboard }: Props) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <DashboardHeader open={open} setOpen={setOpen} />
      {
        isDashboard && (
          <DashboardWidgets open={open}  />
        )
      }
    </div>
  );
};

export default DashBoardHero;
