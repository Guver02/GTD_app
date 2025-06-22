import { useGlobalTooltip } from "../app/providers/GlobalTooltip"

const storageError = (err) => {
    console.error('Error en el Storage', err)
}

const unknownError = (err) => {

    console.error('Error desconocido', err)
    alert(`Error desconocido: ${err}`)
}

export {storageError, unknownError}
