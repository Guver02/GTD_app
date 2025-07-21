import React, { useState } from "react";
import * as style from "./ProfileView.module.css";
import { User, Mail, Edit3, Key } from "lucide-react";
import { useLanguage } from "../custom_hooks/useLanguage";

const {
    container,
    avatar,
    userInfo,
    inputField,
    name,
    email,
    editButton,
    section,
    sectionTitle,
    sectionContent,
    passwordSection,
    passwordInput,
} = style;

function ProfileView() {
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const [nameValue, setNameValue] = useState("John Doe");
    const [emailValue, setEmailValue] = useState("john.doe@example.com");

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { translation } = useLanguage()

    return (
        <div className={container}>
            <div className={avatar}>
                <User size={80} />
            </div>

            <div className={userInfo}>
                {isEditingName ? (
                    <input
                        className={inputField}
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        autoFocus
                    />
                ) : (
                    <h2 className={name} onClick={() => setIsEditingName(true)}>
                        {nameValue}
                    </h2>
                )}

                {isEditingEmail ? (
                    <input
                        className={inputField}
                        value={emailValue}
                        onChange={(e) => setEmailValue(e.target.value)}
                        onBlur={() => setIsEditingEmail(false)}
                        autoFocus
                    />
                ) : (
                    <p className={email} onClick={() => setIsEditingEmail(true)}>
                        {emailValue}
                    </p>
                )}
            </div>

            <button className={editButton}>
                <Edit3 size={16} />
                {translation.saveChanges}
            </button>

            <div className={section}>
                <h3 className={sectionTitle}>{translation.profileInfo}</h3>
                <p className={sectionContent}>
                    {translation.editPersonalData}
                </p>
            </div>

            <div className={section}>
                <h3 className={sectionTitle}>{translation.security}</h3>
                <button
                    className={editButton}
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                >
                    <Key size={16} />
                    {translation.changePassword}
                </button>

                {showPasswordFields && (
                    <div className={passwordSection}>
                        <input
                            className={passwordInput}
                            type="password"
                            placeholder="Contraseña actual"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                            className={passwordInput}
                            type="password"
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            className={passwordInput}
                            type="password"
                            placeholder="Confirmar nueva contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export { ProfileView };
