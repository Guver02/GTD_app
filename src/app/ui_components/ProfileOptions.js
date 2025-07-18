import React, { useContext } from "react";
import * as style from "./ProfileOptions.module.css";
import { User, LogOut, Settings, Moon, Sun } from "lucide-react";
import { useAuthController } from "../../controllers/authController";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../providers/ModalContext";
import { ProfileView } from "./ProfileView";
import { useTheme } from "../providers/ThemeContext";


const {
    container,
    list,
    listGroup,
    logoutButton
} = style;

function ProfileOptions({ }) {
    const {theme, setTheme} = useTheme()
    const {logout} = useAuthController()
    const navigate = useNavigate()
    const {openModal, closeModal} = useContext(ModalContext)

    const handleLogOut = async () => {
        navigate('/auth/login')
        await logout()
    };

    const handleProfile = () => {
        openModal(<ProfileView/>);

    };

    const handleMoonMode = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
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
                        <button onClick={handleMoonMode}>
                            {theme == 'light'
                            ?
                            <>
                                <Moon/>
                            <span>Moon Mode</span>
                            </>
                            :
                            <>
                            <Sun/>

                            <span>Light Mode</span>
                            </>
                            }
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
