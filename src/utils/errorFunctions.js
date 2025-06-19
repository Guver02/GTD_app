const storageError = (err) => {
    console.error('Error en el Storage', err)
}

const unknownError = (err) => {
    console.error('Error desconocido', err)
}

export {storageError, unknownError}
