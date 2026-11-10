export class Andamento {
    status: string;
    id: number;
    data_hora:Date;

    constructor(
        status: string,
        id: number,
        data_hora:Date,
        
    ) {
        this.status =  status;
        this.id = id;
        this.data_hora = data_hora;

    }
}