import React from 'react'
import '@testing-library/jest-dom/'
import {Navbar} from  './Navbar'
import userEvent from '@testing-library/user-event';
import {render, screen, fireEvent} from '@testing-library/react'
import { ModalContext } from '../providers/ModalContext'

test('createButton in NavBar open the modal', async () => {
    const openModalMock = jest.fn()

    render(<ModalContext.Provider
    value={{openModal: openModalMock}}>
        <Navbar/>
    </ModalContext.Provider>)

    const createButton = screen.getByText('Create')
    await userEvent.click(createButton)

    expect(openModalMock).toHaveBeenCalledTimes(1)
})
