import React, { useContext } from "react";
import * as style from "./ProfileOptions.module.css";
import { User, LogOut, Settings, Moon, Sun, Languages } from "lucide-react";
import { useAuthController } from "../../controllers/authController";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../providers/ModalContext";
import { ProfileView } from "./ProfileView";
import { useTheme } from "../providers/ThemeContext";
import { useLanguage } from "../custom_hooks/useLanguage";
import { LanguageSelector } from "./LanguageSelector";


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
    const {translation} = useLanguage()

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

    const handleLanguage = () => {
        openModal(<LanguageSelector/>)
    }

    return (
        <div className={container}>
            <ul className={list}>

                <li className={listGroup}>
                    <li>
                        <button onClick={handleProfile}>
                            <User />
                            <span>{translation.viewProfile}</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={handleLanguage}>
                            <Languages/>
                            <span>{translation.language}</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={handleMoonMode}>
                            {theme == 'light'
                            ?
                            <>
                                <Moon/>
                            <span>{translation.darkMode}</span>
                            </>
                            :
                            <>
                            <Sun/>

                            <span>{translation.lightMode}</span>
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
                            <span>{translation.logout}</span>
                        </button>
                    </li>
                </li>
            </ul>
        </div>
    );
}

export { ProfileOptions };
