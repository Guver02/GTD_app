import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MainPanel } from './MainPanel';

jest.mock('../task_components/CreateTask', () => ({
    CreateTask: () => <div>Formulario de Tarea</div>,
}))

jest.mock('../projects_components/CreateProject', () => ({
    CreateProject: () => <div>Formulario de Proyecto</div>,
}))

describe('MainPanel', () => {
    test('renderiza con la pestaña "Task" activa por defecto', () => {
        render(<MainPanel />)
        expect(screen.getByText('Formulario de Tarea')).toBeInTheDocument()
    });

    test('cambia a la pestaña "Project" y muestra el componente correspondiente', () => {
        render(<MainPanel />)

        fireEvent.click(screen.getByText('Project'));

        expect(screen.getByText('Formulario de Proyecto')).toBeInTheDocument()
    });

    test('vuelve a "Task" al hacer clic nuevamente', () => {
        render(<MainPanel />)

        fireEvent.click(screen.getByText('Project'));
        fireEvent.click(screen.getByText('Task'));

        expect(screen.getByText('Formulario de Tarea')).toBeInTheDocument()
    })
})
