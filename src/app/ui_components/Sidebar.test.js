import React from "react";
import '@testing-library/jest-dom/'
import { render, screen } from '@testing-library/react'
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ModalContext } from "../providers/ModalContext";
import { Sidebar } from "./Sidebar";

jest.mock('./Sidebar.module.css', () => ({
    sidebar: 'sidebar',
    sidebarExpanded: 'sidebarExpanded',
}));

jest.mock('../../store/data_store', () => ({
    useDataStore: jest.fn((selector) =>
        selector({
            specialProjectsBySpecialId: {
                3: { id: 'inbox-project-id' },
            },
            unsectionsByProject: {
                'inbox-project-id': { id: 'unsection-id' },
            },
        })
    ),
}));

test('Sidebar expanded', async () => {
    const openModalMock = jest.fn();

    render(<BrowserRouter>
        <ModalContext.Provider value={{ openModal: openModalMock }}>
            <Sidebar />
        </ModalContext.Provider>
    </BrowserRouter>)

    const sidebar = screen.getByTestId('sidebar')
    const toggleButton = screen.getByTestId('toggle-sidebar')

    expect(sidebar).toBeInTheDocument();
    expect(sidebar).not.toHaveClass('sidebarExpanded')

    await userEvent.click(toggleButton)

    expect(sidebar).toHaveClass('sidebarExpanded')
})
