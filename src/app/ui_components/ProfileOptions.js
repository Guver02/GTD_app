import React from "react";
import * as style from "./ProfileOptions.module.css";
import { User, LogOut, Settings } from "lucide-react";
import { useAuthController } from "../../controllers/authController";
import { useNavigate } from "react-router-dom";


const {
    container,
    list,
    listGroup,
    logoutButton
} = style;

function ProfileOptions({ }) {
    const {logout} = useAuthController()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        navigate('/auth/login')
        await logout()
    };

    const handleProfile = () => {

    };

    const handleConfig = () => {

    };

    return (
        <div className={container}>
            <ul className={list}>

                <li className={listGroup}>
                    <li>
                        <button onClick={handleProfile}>
                            <User />
                            <span>Profile</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={handleConfig}>
                            <Settings />
                            <span>Config</span>
                        </button>
                    </li>
                </li>

                <li className={listGroup}>
                    <li >
                        <button
                        className={logoutButton}
                        onClick={handleLogOut}>
                            <LogOut />
                            <span>Log Out</span>
                        </button>
                    </li>
                </li>
            </ul>
        </div>
    );
}

export { ProfileOptions };
