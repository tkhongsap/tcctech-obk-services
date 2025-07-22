export class JsonConvert {
  static objectToJson(object: any): any {
    const result = JSON.parse(JSON.stringify(object));
    return result;
  }
}
