import React from "react";
import {
    Sparkles,
    Sprout,
    Activity,
    CheckCircle2,
    Moon,
    Ghost,
} from "lucide-react";
import * as styles from "./LifeCycleBadge.module.css";

const { badge, circle, text, newborn, growing, active, mature, idle, forgotten, icon, tittleText } = styles;

function LifeCycleBadge({ item }) {
    const {
        created_at,
        updated_at,
        description,
        item_name,
        status,

    } = item;



    const createdDate = new Date(created_at);
    const updatedDate = new Date(updated_at);
    const now = new Date();
    const ageInHours = (now - createdDate) / (1000 * 60 * 60);
    const timeSinceUpdate = (now - updatedDate) / (1000 * 60 * 60);

    let stage = "Nacimiento";
    let Icon = Sparkles;
    let colorClass = newborn;

    const nameLength = item_name?.trim()?.length || 0;
    const hasDescription = description?.trim()?.length > 0;
    const isCompleted = status === "completed";

    if (ageInHours < 1) {
        stage = "Nacimiento";
        Icon = Sparkles;
        colorClass = newborn;
    } else if (ageInHours < 12 && !hasDescription) {
        stage = "Brote";
        Icon = Sprout;
        colorClass = growing;
    } else if (!isCompleted && (hasDescription || nameLength > 15)) {
        stage = "Activo";
        Icon = Activity;
        colorClass = active;
    } else if (isCompleted && nameLength > 10 && hasDescription) {
        stage = "Terminado";
        Icon = CheckCircle2;
        colorClass = mature;
    } else if (timeSinceUpdate > 24 && !isCompleted) {
        stage = "Inactivo";
        Icon = Moon;
        colorClass = idle;
    } else if (ageInHours > 72 && !hasDescription && !isCompleted) {
        stage = "Olvidado";
        Icon = Ghost;
        colorClass = forgotten;
    }

    return (
        <div className={badge} title={`Ciclo de vida: ${stage}`}>

            <span className={text}>{stage}</span>
            <div className={`${circle} ${colorClass}`}>
                <Icon className={icon} />
            </div>

        </div>
    );
}

export { LifeCycleBadge };
