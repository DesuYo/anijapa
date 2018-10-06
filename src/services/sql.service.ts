import * as pg from 'pg'

export class Table {
  private _pgClient: pg.Client
  private _name: string

  constructor (pgURL: string, tableName: string) {
    this._pgClient = new pg.Client(pgURL)
    this._name = tableName
  }

  private _convertData (data: any): Array<any> {
    let output = []
    for (let key in data) {
      output.push(key)
      output.push(data[key])
    }
    return output
  }

  public async insert (data: object): Promise<object> {
    try {
      let values = this._convertData(data)
      let exchanges = []
      for (let i = 0; i < values.length; i++) { 
        exchanges.push(`$${i + 2}`) 
      }
      const queryString = `
        INSERT INTO $1 ( ${exchanges.filter((_: string, i: number) => i % 2 == 0).join(', ')} ) 
        VALUES ( ${exchanges.filter((_:string, i: number) => i % 2 != 0).join(', ')} );`
      console.log(`QUERY: ${queryString}`)
      await this._pgClient.connect()
      return (await this._pgClient.query({
        text: queryString,
        values: [ this._name, ...values ]
      })).rows[0]
    } catch (error) {
      throw error
    }
  }

  public async patch (data: object, where: object): Promise<object> {
    let setValues = this._convertData(data)
    let whereValues = this._convertData(where)
    let setLength = setValues.length, valuesLength = setLength + whereValues.length
    let exchanges = []
    for (let i = 0; i < valuesLength; i += 2) { 
      exchanges.push(`$${i + 2} = $${i + 3}`) 
    }
    const queryString = `
      UPDATE $1 SET ${exchanges.slice(0, setLength).join(', ')}
      WHERE ( ${exchanges.slice(setLength, valuesLength).join(' AND ')} );`
    console.log(queryString)
    await this._pgClient.connect()
    return (await this._pgClient.query({
      text: queryString,
      values: [ this._name, ...setValues, ...whereValues ]
    })).rows[0]
  }

  public async filter (where: object): Promise<Array<object>> {
    let whereValues = this._convertData(where)
    let exchanges = []
    for (let i = 0; i < whereValues.length; i += 2) {
      exchanges.push(`$${i + 2} = $${i + 3}`)
    } 
    const queryString = `
      SELECT * FROM $1 WHERE ${exchanges.join(' AND ')} );`
    console.log(queryString)
    await this._pgClient.connect()
    return (await this._pgClient.query({
      text: queryString,
      values: [ this._name, ...whereValues ]
    })).rows
  }

  public async remove (where: object) {
    
  }
}