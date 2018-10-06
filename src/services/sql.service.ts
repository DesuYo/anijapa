import * as pg from 'pg'

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
    try {
      let params = this._convertData(data)
      let exchanges = []
      const length = params.length
      
      for (let i = 0; i < length; i++) exchanges.push(`$${i + 2}`)
      const queryString = `INSERT INTO $1 ( ${exchanges.slice(0, length / 2).join(',')} ) 
        VALUES ( ${exchanges.slice(length / 2, length).join(',')} );`
      console.log(queryString)
      await this._pgClient.connect()
      return (await this._pgClient.query({
        text: queryString,
        values: [ table, ...params ]
      })).rows[0]
    } catch (error) {
      throw error
    }
       
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
}