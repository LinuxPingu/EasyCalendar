export class Helper{
    /*Checks if all spaces Are filled*/ 
    static isObjectFullyFilled(obj: any): boolean {
        for (const prop in obj) {
            if (obj[prop] === null || obj[prop] === '') {
              return false;
            }
          }
          return true;
    }
}