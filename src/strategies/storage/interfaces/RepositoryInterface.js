class RepositoryInterface {
    create(item) {
        throw new Error("Method 'create()' must be implemented.");
    }

    update(item) {
        throw new Error("Method 'update()' must be implemented.");
    }

    delete(id) {
        throw new Error("Method 'delete()' must be implemented.");
    }
}

export { RepositoryInterface }
