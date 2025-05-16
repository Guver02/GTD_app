import React, { useEffect, useState } from "react";
import { useDataStore } from "../../store/data_store"
import { apiService } from "../../services/apiService";
import { shallow } from "zustand/shallow";
import { SpinnerLoading } from "../ui_components/SpinnerLoading";
import { Sidebar } from "../ui_components/Sidebar";
import * as styles from "./Application.module.css"
import { Navbar } from "../ui_components/Navbar";
import { Route, Routes } from "react-router-dom";
import { Login } from "../auth_components/Login";
import { SignIn } from "../auth_components/SignIn";
import { Inbox } from "../views_container/Inbox";
import { Projects } from "../views_container/Projects";
import { ModalProvider } from "../providers/ModalContext";
import { Dashboard } from "../views_container/Dashboard";
import { InboxView } from "../views_container/InboxView";
import { Someday } from "../views_container/Someday";
import { ReferenceFile } from "../views_container/ReferenceFile";
import { TrakingFile } from "../views_container/TrakingFile";
import { Waiting } from "../views_container/Waiting";

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

function Application ({children}) {
    const [isLoading, setIsLoading] = useState(true)
    const tasks = useDataStore((state) => state.tasks, shallow)
    const setItems = useDataStore((state) => state.setItems)



    useEffect(() => {
        async function getItems() {
            const data = await apiService.get('/api/v1/items');
            setItems(data)
            setIsLoading(false)
        }

        getItems();
    }, [setItems])

    if(isLoading){
        return (<SpinnerLoading/>)
    }else{
        return (<ModalProvider>
        <div className={applicationContainer}>

            <Sidebar/>

            <div className={grow}>

                <Navbar/>

                <div className={applicationContent}>
                <Routes>
                    <Route path="/" element={<InboxView/>} />
                    <Route path="/someday" element={<Someday specialSomedayID={specialTypesIDS.someday}/>} />
                    <Route path="/traking-file" element={/**<Inbox specialId={specialTypesIDS.trackingFile}/> */ <TrakingFile/>} />
                    <Route path="/waiting" element={<Waiting specialWaitingID={specialTypesIDS.waiting}/>} />
                    <Route path="/reference-file" element={<ReferenceFile specialReferenceFileID={specialTypesIDS.referenceFile}/>} />

                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/project/:id" element={<Projects/>} />
                </Routes>
                </div>

            </div>

        </div>
        </ModalProvider>)
    }
}

export {Application}
