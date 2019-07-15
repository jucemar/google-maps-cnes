export class DataDashboard {

    constructor(estabelecimentos) {
        this._totalEstabelecimentos = estabelecimentos.length
        this._totalEstabelecimentosComGeo = estabelecimentos.reduce((count, estabelecimento) => {
            if (estabelecimento.LATITUDE) {
                return count + 1
            }
            return count
        }, 0)

        this._totalEstabelecimentosSemGeo = this.totalEstabelecimentos - this.totalEstabelecimentosComGeo
        
   
        this._totalEstabelecimentosGeoDuvidosas = new Set()
        estabelecimentos.filter((value, index) => {           
            for (let i = 0; i < estabelecimentos.length; i++) {
                let b = value.LATITUDE === estabelecimentos[i].LATITUDE && value.LONGITUDE === estabelecimentos[i].LONGITUDE && estabelecimentos[i].LONGITUDE && estabelecimentos[i].LATITUDE && value.LONGITUDE && value.LATITUDE
                if (index !== i && b) {
                    console.log(`${index} ${i} ${b} ${value.NOME_FANTASIA} ${value.LATITUDE} ${value.LONGITUDE} ${estabelecimentos[i].NOME_FANTASIA} ${estabelecimentos[i].LATITUDE}  ${estabelecimentos[i].LONGITUDE}`)
                    this._totalEstabelecimentosGeoDuvidosas.add(estabelecimentos[i].CNES)
                }
            }
        })
        console.log(this._totalEstabelecimentosGeoDuvidosas)

        /*         let temp=estabelecimentos.filter(
                    (valueAtual, indexAtual,estabelecimentos)=>{
                        let teste=estabelecimentos.find((value,index)=>{
                            if(index!==indexAtual){
                                if(value.LATITUDE===valueAtual.LATITUDE && value.LONGITUDE===valueAtual.LONGITUDE){
                                    console.log(valueAtual.NOME_FANTASIA)
                                    return -1
                                }else{
                                    return 1
                                }
                            }
                        })
        
                        if(teste>=0){
                            return true
                        }else{
                            return false
                        }
                    }
                ) */
        


        /*
        let tempLat = estabelecimentos.map(value => value.LATITUDE)
        let tempLatSelected = estabelecimentos.filter((value, index) => {
            if (tempLat.lastIndexOf(value.LATITUDE) === index
                && tempLat.indexOf(value.LATITUDE) === index) {
                return false
            } else if (value.LATITUDE) {
                return true
            }
        })



        let tempLon = tempLatSelected.map(value => value.LONGITUDE)
        let tempLonSelected = tempLatSelected.filter((value, index) => {
            if (tempLon.lastIndexOf(value.LONGITUDE) === index
                && tempLon.indexOf(value.LONGITUDE) === index) {
                return false
            } else if (value.LONGITUDE) {
                return true
            }
        })

        for (let i = 0; i < tempLonSelected.length; i++) {
            for (let jLinq.from(estabelecimentos). = i+1; jLinq.from(estabelecimentos). < tempLonSelected.length; jLinq.from(estabelecimentos).++) {
                if (tempLonSelected[i].LATITUDE === tempLonSelected[jLinq.from(estabelecimentos).].LATITUDE
                    && tempLonSelected[i].LONGITUDE === tempLonSelected[jLinq.from(estabelecimentos).].LONGITUDE) {
                        this._estabelecimentosGeoDuvidosas.push(tempLonSelected[i])
                }

            }


        }*/
        //console.table(this._estabelecimentosGeoDuvidosas)
    }

    get totalEstabelecimentos() {
        return this._totalEstabelecimentos
    }
    set totalEstabelecimentos(total) {
        this._totalEstabelecimentos = total
    }

    get totalEstabelecimentosComGeo() {
        return this._totalEstabelecimentosComGeo
    }
    set totalEstabelecimentosComGeo(total) {
        this._totalEstabelecimentosComGeo = total
    }

    get totalEstabelecimentosSemGeo() {
        return this._totalEstabelecimentosSemGeo
    }
    set totalEstabelecimentosSemGeo(total) {
        this._totalEstabelecimentosSemGeo = total
    }
    get totalEstabelecimentosGeoDuvidosas() {
        return this._totalEstabelecimentosGeoDuvidosas
    }
    set totalEstabelecimentosGeoDuvidosas(total) {
        this._totalEstabelecimentosGeoDuvidosas=total
    }

}