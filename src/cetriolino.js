"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Cetriolino {
    constructor(filePath, autoDump) {
        this.db = {};
        this.filePath = filePath;
        this.load(filePath);
        this.autoDump = autoDump;
    }
    get(key) {
        return this.db[key];
    }
    set(key, value) {
        this.db[key] = value;
        if (this.autoDump) {
            this.dump(this.filePath);
        }
        return this.db;
    }
    remove(key) {
        const removed = delete this.db[key];
        if (this.autoDump) {
            this.dump(this.filePath);
        }
        return removed;
    }
    exists(key) {
        return this.db[key] !== undefined;
    }
    keys() {
        return this.db.keys();
    }
    clear() {
        this.db = {};
    }
    load(filePath) {
        try {
            const content = fs.readFileSync(filePath);
            this.db = JSON.parse(content.toString()) || {};
        }
        catch (e) {
            if (e.code === "ENOENT") {
                this.db = {};
            }
            else {
                throw e;
            }
        }
    }
    dump(filePath) {
        fs.writeFile(filePath, JSON.stringify(this.db), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log('The db was saved!');
        });
    }
}
module.exports = { Cetriolino : Cetriolino }
