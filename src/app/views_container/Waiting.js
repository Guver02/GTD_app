import React from "react";
import { useDataStore } from "../../store/data_store";
import * as styles from './Waiting.module.css'
const {
    waitingContainer,
    tittle,
    noDelegatedImg,
    bannerContainer,
    description
} = styles

function Waiting ({specialWaitingID}) {

    return (
        <div className={waitingContainer}>
            <span className={tittle}>Waiting</span>
            <div className={bannerContainer}>
                <img
                className={noDelegatedImg}
                src="assets/undraw-meet-the-team.svg"
                alt="undraw-meet-the-team"/>
                <span
                className={description}
                >Parece que aún no tienes tareas delegadas</span>
            </div>
        </div>
    )
}

export {Waiting}
