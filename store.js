import fs from 'node:fs/promises'

export const getUsers = async () => {
    try {
        let res = JSON.parse(await fs.readFile("./db.json", {encoding:"utf-8"}));
        return res;
    } catch (err){
        fs.writeFile("./db.json", JSON.stringify([]));
        return [];
    }
}

export const addUser = async (userid) => {
    try {
        let res = JSON.parse(await fs.readFile("./db.json", {encoding:"utf-8"}));
        console.log(res);
        let updated = new Set([...res, userid]);
        console.log(updated)
        await fs.writeFile("./db.json", JSON.stringify([...updated]));
        return true;
    } catch (err){
        fs.writeFile("./db.json", JSON.stringify([userid]));
        return true;
    }
}


export const removeUser = async (userid) => {
    try {
        let res = new Set(JSON.parse(await fs.readFile("./db.json", {encoding:"utf-8"})));
        res.delete(userid);
        await fs.writeFile("./db.json", JSON.stringify([...res]));
        return true;
    } catch (err){
        return true;
    }
}
