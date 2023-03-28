export default class FetchAPI {
    constructor (url){
        this.url = url;
    }

    async getFetchRequest(){
        try{
            const response = await fetch(this.url);
            const data = await response.json();
            return data;
        } catch(error){
            console.error(error)
        }
    }
}