"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg = require("pg");
class PostgresService {
    constructor(pgURL) {
        this._pgClient = new pg.Client(pgURL);
    }
    _convertData(data) {
        let keys = [], values = [];
        for (let key in data) {
            keys.push(key);
            values.push(data[key]);
        }
        return [].concat(keys, values);
    }
    insert(table, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let params = this._convertData(data);
                let exchanges = [];
                const length = params.length;
                for (let i = 0; i < length; i++)
                    exchanges.push(`$${i + 2}`);
                const queryString = `INSERT INTO $1 ( ${exchanges.slice(0, length / 2).join(',')} ) 
        VALUES ( ${exchanges.slice(length / 2, length).join(',')} );`;
                console.log(queryString);
                yield this._pgClient.connect();
                return (yield this._pgClient.query({
                    text: queryString,
                    values: [table, ...params]
                })).rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    patch(table, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this._convertData(data);
            let exchanges = [];
            const length = params.length;
            for (let i = 0; i < length; i++)
                exchanges.push(`$${i + 2}`);
            return (yield this._pgClient.query({
                text: `UPDATE $1 SET ( ${exchanges.join(',')} )
        WHERE $${length + 2};`,
                values: [table, ...params, id]
            })).rows[0];
        });
    }
    filter(table, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = this._convertData(data);
            let exchanges = [];
            const length = params.length;
            for (let i = 0; i < length; i += 2)
                exchanges.push(`$${i + 2} = $${i + 3}`);
            return (yield this._pgClient.query({
                text: `SELECT * FROM $1 WHERE ${exchanges.join(' AND ')} );`,
                values: [table, ...params]
            })).rows;
        });
    }
}
exports.PostgresService = PostgresService;
//# sourceMappingURL=sql.service.js.map