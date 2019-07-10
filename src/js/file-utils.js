import * as csv from 'csvtojson' 

export class FileUtils {

    static descompactar(file) {
        csv()
            .fromFile(file)
            .then((jsonObj) => {
                return jsonObj
            })
    }
}
