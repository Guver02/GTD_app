import { renderHook, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useSidebarLogic } from './useSidebarLogic';
import { ModalContext } from '../providers/ModalContext';

// Wrapper que configura router y contexto
const createWrapper = (initialPath = '/app/inbox') => {
    const openModal = jest.fn();

    return ({ children }) => (
        <ModalContext.Provider value={{ openModal }}>
            <MemoryRouter initialEntries={[initialPath]}>
                <Routes>
                    <Route path="*" element={children} />
                </Routes>
            </MemoryRouter>
        </ModalContext.Provider>
    );
};

describe('useSidebarLogic', () => {

    test('establece activeItem como "inbox" cuando la ruta es /app/inbox', () => {
        const wrapper = createWrapper('/app/inbox');
        const { result } = renderHook(() => useSidebarLogic(), { wrapper });

        expect(result.current.activeItem).toBe('inbox');
    });

    test('establece activeItem correctamente cuando cambia la ruta', () => {
        const wrapper = createWrapper('/app/dashboard');
        const { result } = renderHook(() => useSidebarLogic(), { wrapper });

        expect(result.current.activeItem).toBe('dashboard');
    });

    test('handleNavigate cambia location y actualiza activeItem', async () => {
        const wrapper = createWrapper('/app/inbox');
        const { result, rerender } = renderHook(() => useSidebarLogic(), { wrapper });

        expect(result.current.activeItem).toBe('inbox');

        act(() => {
            result.current.handleNavigate('/app/project/UUID-123');
        });

        /*     rerender();
         */

        expect(result.current.activeItem).toBe('project');
    });
});
