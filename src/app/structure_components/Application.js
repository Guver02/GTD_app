import React, { useContext, useEffect, useState } from "react";
import { Sidebar } from "../ui_components/Sidebar";
import * as styles from "./Application.module.css"
import { Navbar } from "../ui_components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import { Projects } from "../views_container/Projects";
import { ModalContext, ModalProvider } from "../providers/ModalContext";
import { Dashboard } from "../views_container/Dashboard";
import { InboxView } from "../views_container/InboxView";
import { Someday } from "../views_container/Someday";
import { ReferenceFile } from "../views_container/ReferenceFile";
import { TrakingFile } from "../views_container/TrakingFile";
import { Waiting } from "../views_container/Waiting";
import { GlobalTooltipProvider } from "../providers/GlobalTooltip";
import { MainPanel } from "../ui_components/MainPanel";

const {
    applicationContainer,
    grow,
    applicationContent
} = styles

const specialTypesIDS = {
    subTodo: 1,
    unsectioned: 2,
    inbox: 3,
    someday: 4,
    trackingFile: 5,
    waiting: 6,
    referenceFile: 7,
};

function Application() {
    const { openModal } = useContext(ModalContext);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                openModal(<MainPanel/>);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [openModal]);


    return (
        <div className={applicationContainer}>

            <Sidebar />

            <div className={grow}>

                <Navbar />

                <div className={applicationContent}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/app/inbox" replace />} />
                        <Route path="/inbox" element={<InboxView />} />
                        <Route path="/someday" element={<Someday specialSomedayID={specialTypesIDS.someday} />} />
                        <Route path="/traking-file" element={<TrakingFile />} />
                        <Route path="/waiting" element={<Waiting specialWaitingID={specialTypesIDS.waiting} />} />
                        <Route path="/reference-file" element={<ReferenceFile specialReferenceFileID={specialTypesIDS.referenceFile} />} />

                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/project/:id" element={<Projects />} />
                    </Routes>
                </div>

            </div>

        </div>
    )

}

export { Application }
