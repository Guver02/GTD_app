import React from "react";
import {
  Clock,
  Timer,
  History,
  Hourglass,
  CalendarDays,
} from "lucide-react";

import * as styles from "./TimeStatusCircle.module.css";

export function TimeStatusCircle({ createdAt }) {
  const { circle, icon, green, blue, yellow, orange, red } = styles;

  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInMs = now - createdDate;
  const diffInHours = diffInMs / (1000 * 60 * 60);

  let colorClass = "";
  let Icon = Clock;

  if (diffInHours < 1) {
    colorClass = green;
    Icon = Clock;
  } else if (diffInHours < 6) {
    colorClass = blue;
    Icon = Timer;
  } else if (diffInHours < 24) {
    colorClass = yellow;
    Icon = Hourglass;
  } else if (diffInHours < 72) {
    colorClass = orange;
    Icon = History;
  } else {
    colorClass = red;
    Icon = CalendarDays;
  }

  return (
    <div className={`${circle} ${colorClass}`} title={`Creado el ${createdDate.toLocaleString()}`}>
      <Icon className={icon} />
    </div>
  );
}
