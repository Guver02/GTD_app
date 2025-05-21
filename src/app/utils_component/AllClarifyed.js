import React from "react";
import * as styles from './AllClarifyed.module.css'

const {
    clarifyedContainer
} = styles

function AllClarifyed () {

    return(<div className={clarifyedContainer}>
        <div>
            <img
            src="assets/undraw_reminder.svg"
            alt="Clean Clarify"/>
            <span>Todo esta aclarado! :D</span>
        </div>
    </div>)
}

export {AllClarifyed}
