export class DataDashboard{

    constructor(estabelecimentos){
        this._estabelecimentos=estabelecimentos
        this._totalEstabelecimentos=estabelecimentos.length
        this._totalEstabelecimentosComGeo=this._estabelecimentos.reduce((count,estabelecimento)=>{
            if(estabelecimento.LATITUDE){
                return count+1
            }
            return count
        },0)

        this._totalEstabelecimentosSemGeo=this.totalEstabelecimentos-this.totalEstabelecimentosComGeo
    }
    
    get totalEstabelecimentos(){
        return this._totalEstabelecimentos
    }
    set totalEstabelecimentos(total){
        this._totalEstabelecimentos=total
    }

    get totalEstabelecimentosComGeo(){
        return this._totalEstabelecimentosComGeo
    }
    set totalEstabelecimentosComGeo(total){
        this._totalEstabelecimentosComGeo=total
    }

    get totalEstabelecimentosSemGeo(){
        return this._totalEstabelecimentosSemGeo
    }
    set totalEstabelecimentosSemGeo(total){
        this._totalEstabelecimentosSemGeo=total
    }

}