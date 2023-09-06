function fetchImages(q) {
    return fetch(`https://pixabay.com/api/?q=${q}&key=39292728-1eb1db6d28a9fb64c22d19118`)
        .then(resp => {
            if (!resp.ok) {
                throw new Error(resp.status)
            }
            return resp.json()
        })
}
export {fetchImages}