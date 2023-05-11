async function fetchAventuras() {
    const aventuras = await fetch("http://localhost:8080/aventura").then(r => r.json())
    console.table(aventuras)
    return aventuras
}

fetchAventuras()