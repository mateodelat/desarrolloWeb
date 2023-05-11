import { Storage } from "aws-amplify";

function isUrl(str) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(str);
}

export async function getStorageImages(ave) {
    const data = ave.imagenDetalle
    try {


        // Obtener urls de Storage
        const imagenDetalle = data ? isUrl(data) ? data : await Storage.get(data) : null

        return {
            ...ave,
            imagenDetalle,
        }
    } catch (error) {
        console.log("Error obteniendo imagen de storage")
        console.log(error)
    }

}

