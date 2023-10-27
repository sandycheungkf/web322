const setData = require("../data/setData");
const themeData = require("../data/themeData");
let sets = [];

function Initialize(){
    return new Promise((resolve, reject) => {
        sets = setData.map((set) => {
            const obj = themeData.find((theme) => theme.id === set.theme_id);
            return { ...set, theme: obj.name};
        });
        if (sets.length > 0) {
            resolve();
        } else {
            reject("Error: Initialize");
        }
    });
    }

function getAllSets(){
    return new Promise((resolve, reject) => {
        if(sets.length > 0){
            resolve(sets);
        }else{
            reject("Error:getAllSets.");
        }
    })
}

function getSetByNum(setNum){
    return new Promise((resolve, reject) => {
        const num = sets.find((set) => set.set_num === setNum);
    if (num) {
        resolve(num);
    } else {
        reject(`Error:getSetByNum,${setNum}`);
    }});
    }

     

function getSetsByTheme(theme){
    return new Promise((resolve, reject) => {
    const resultSet =  sets.filter((set) => set.theme.toUpperCase().includes(theme.toUpperCase()));
    if (resultSet.length>0){
        resolve(resultSet);
    }else{
        reject(`Error: Sets with theme ${theme} not found.`);
    }
});
}


module.exports = {
    Initialize,
    getAllSets,
    getSetByNum,
    getSetsByTheme,
};

