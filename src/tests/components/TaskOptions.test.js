import React from "react";
import '@testing-library/jest-dom'
import {TaskOptions} from '../../app/task_components/TaskOptions'
import {render, screen} from '@testing-library/react'

test('Render text-actions', () => {
    const id = 'uuid'
    const component = render(<TaskOptions id={id}/>)

    expect(component.container).toHaveTextContent('Eliminar')
    expect(component.container).toHaveTextContent('Editar')
    expect(component.container).toHaveTextContent('Acción siguiente')
})
