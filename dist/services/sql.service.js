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
class Table {
    constructor(pgURL, tableName) {
        this._pgClient = new pg.Client(pgURL);
        this._name = tableName;
    }
    _convertData(data) {
        let output = [];
        for (let key in data) {
            output.push(key);
            output.push(data[key]);
        }
        return output;
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let values = this._convertData(data);
                let exchanges = [];
                for (let i = 0; i < values.length; i++) {
                    exchanges.push(`$${i + 2}`);
                }
                const queryString = `
        INSERT INTO $1 ( ${exchanges.filter((_, i) => i % 2 == 0).join(', ')} ) 
        VALUES ( ${exchanges.filter((_, i) => i % 2 != 0).join(', ')} );`;
                console.log(`QUERY: ${queryString}`);
                yield this._pgClient.connect();
                return (yield this._pgClient.query({
                    text: queryString,
                    values: [this._name, ...values]
                })).rows[0];
            }
            catch (error) {
                throw error;
            }
        });
    }
    patch(data, where) {
        return __awaiter(this, void 0, void 0, function* () {
            let setValues = this._convertData(data);
            let whereValues = this._convertData(where);
            let setLength = setValues.length, valuesLength = setLength + whereValues.length;
            let exchanges = [];
            for (let i = 0; i < valuesLength; i += 2) {
                exchanges.push(`$${i + 2} = $${i + 3}`);
            }
            const queryString = `
      UPDATE $1 SET ${exchanges.slice(0, setLength).join(', ')}
      WHERE ( ${exchanges.slice(setLength, valuesLength).join(' AND ')} );`;
            console.log(queryString);
            yield this._pgClient.connect();
            return (yield this._pgClient.query({
                text: queryString,
                values: [this._name, ...setValues, ...whereValues]
            })).rows[0];
        });
    }
    filter(where) {
        return __awaiter(this, void 0, void 0, function* () {
            let whereValues = this._convertData(where);
            let exchanges = [];
            for (let i = 0; i < whereValues.length; i += 2) {
                exchanges.push(`$${i + 2} = $${i + 3}`);
            }
            const queryString = `
      SELECT * FROM $1 WHERE ${exchanges.join(' AND ')} );`;
            console.log(queryString);
            yield this._pgClient.connect();
            return (yield this._pgClient.query({
                text: queryString,
                values: [this._name, ...whereValues]
            })).rows;
        });
    }
    remove(where) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.Table = Table;
//# sourceMappingURL=sql.service.js.map