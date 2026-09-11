// forma de que si esta apareciendo en console de java en web
console.log("JavaScript conectado correctamente");

// variables listas
const formulario = document.querySelector("#formulario-busqueda");
const busqueda = document.querySelector("#busqueda");

// Detectamos cuando se envía el formulario
formulario.addEventListener("submit", function(event) {

    // Evitamos que la página se recargue
    event.preventDefault();

    // Obtenemos lo que escribió el usuario y codificamos los espacios
    const nombreSerie = encodeURIComponent(busqueda.value);

    // Hacemos la primera petición a la API
    axios.get("https://api.tvmaze.com/search/shows?q=" + nombreSerie)
        .then(function(respuesta) {

            // Buscamos dónde mostrar los resultados
            const resultados = document.querySelector("#resultados");

            // Comprobamos si no hubo resultados
            if (respuesta.data.length === 0) {

                resultados.innerHTML = "<p>No se encontraron series.</p>";

            } else {

                // Guardamos los datos de la primera serie
                const serie = respuesta.data[0].show;

                // Hacemos una segunda petición usando el ID de la serie
                axios.get("https://api.tvmaze.com/shows/" + serie.id)
                    .then(function(respuestaSerie) {

                        // Guardamos los datos completos de la serie
                        const detalles = respuestaSerie.data;

                        // Mostramos toda la información en la página
                        resultados.innerHTML = `
                            <h3>${detalles.name}</h3>

                            <img 
                                src="${detalles.image.medium}" 
                                alt="Imagen de ${detalles.name}"
                            >

                            <p>
                                <strong>Géneros:</strong> 
                                ${detalles.genres.join(", ")}
                            </p>

                            <p>
                                <strong>Calificación:</strong> 
                                ${detalles.rating.average}
                            </p>

                            <p>
                                <strong>Resumen:</strong> 
                                ${detalles.summary}
                            </p>
                        `;

                    })
                    .catch(function(error) {

                        console.log("Error al obtener los detalles:", error);
                        resultados.innerHTML = "<p>Ocurrió un error al obtener los detalles de la serie.</p>";

                    });
            }

        })
        .catch(function(error) {

            console.log("Error al buscar la serie:", error);

            const resultados = document.querySelector("#resultados");

            resultados.innerHTML = "<p>Ocurrió un error al buscar la serie.</p>";

        });

});