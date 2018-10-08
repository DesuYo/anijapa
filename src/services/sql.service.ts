import * as pg from 'pg'

<<<<<<< HEAD
export class PostgresService {
  private _pgClient: pg.Client

  constructor (pgURL: string) {
    this._pgClient = new pg.Client(pgURL)
  }

  private _convertData (data: any): Array<any> {
    let keys = [], values = []
    for (let key in data) {
      keys.push(key)
      values.push(data[key])
    }
    return [].concat(keys, values)
  }

  public async insert (table: string, data: any): Promise<object> {
    let params = this._convertData(data)
    let exchanges = []
    const length = params.length
    
    for (let i = 0; i < length; i++) exchanges.push(`$${i + 2}`)
    
    return (await this._pgClient.query({
      text: `INSERT INTO $1 ( ${exchanges.slice(0, length / 2).join(',')} ) 
        VALUES ( ${exchanges.slice(length / 2, length).join(',')} );`,
      values: [ table, ...params ]
    })).rows[0]   
  }

  public async patch (table: string, id: number, data: any): Promise<object> {
    let params = this._convertData(data)
    let exchanges = []
    const length = params.length
    
    for (let i = 0; i < length; i++) exchanges.push(`$${i + 2}`)
    
    return (await this._pgClient.query({
      text: `UPDATE $1 SET ( ${exchanges.join(',')} )
        WHERE $${length + 2};`,
      values: [ table, ...params, id ]
    })).rows[0]
  }

  public async filter (table: string, data: any): Promise<Array<object>> {
    let params = this._convertData(data)
    let exchanges = []
    const length = params.length
    
    for (let i = 0; i < length; i += 2) exchanges.push(`$${i + 2} = $${i + 3}`)
    
    return (await this._pgClient.query({
      text: `SELECT * FROM $1 WHERE ${exchanges.join(' AND ')} );`,
      values: [ table, ...params ]
    })).rows
  }
=======
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
>>>>>>> 1046561eba945e3d863c02954b0a4d42d847aa8d
}