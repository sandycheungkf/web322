require('dotenv').config();

// const setData = require("../data/setData");
// const themeData = require("../data/themeData");
const Sequelize = require('sequelize');

// let sets = [];

  // set up sequelize to point to our postgres database

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER,process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

  const Theme = sequelize.define('Theme', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  }, {
    createdAt: false, 
    updatedAt: false, 
  });
  
  const Set = sequelize.define('Set', {
    set_num: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.INTEGER,
    },
    num_parts: {
      type: Sequelize.INTEGER,
    },
    theme_id: {
      type: Sequelize.INTEGER,
    },
    img_url: {
      type: Sequelize.STRING,
    },
  }, {
    createdAt: false,
    updatedAt: false, 
    });
  
  Set.belongsTo(Theme, { foreignKey: 'theme_id' });
  
  function Initialize() { 
    return new Promise(async (resolve, reject) => {
      try{
        await sequelize.sync();
        resolve();
      }catch(err){
        reject(err.message)
      }
    });
  
  }
  
function getAllSets() {
  return Set.findAll({
    include: [Theme],
  })
    .then((sets) => {
      return sets;
    })
    .catch((error) => {
      throw error;
    });
}

function getSetByNum(setNum) {
  return new Promise((resolve, reject) => {
    Set.findOne({
      where: { set_num: setNum },
      include: [Theme],
    })
      .then((set) => {
        if (!set) {
          reject(new Error("Unable to find requested set"));
        }
        resolve(set);
      })
      .catch((error) => {
        reject(error);
      });
  });
}


function getSetsByTheme(themeName) {
  return new Promise((resolve, reject) => {
    Set.findAll({
      include: [{ model: Theme, where: { name: { [Sequelize.Op.iLike]: `%${themeName}%` } } }],
    })
      .then((set) => {
        if (!set.length === 0) {
          reject(new Error("Unable to find requested set"));
        }
        resolve(set);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function addSet(setData) {
  return new Promise((resolve, reject) => {
    Set.create({
      set_num: setData.set_num,
      name: setData.name,
      year: setData.year,
      num_parts: setData.num_parts,
      theme_id: setData.theme_id,
      img_url: setData.img_url,
    })
      .then(() => {
        resolve(); 
      })
      .catch((err) => {
        reject(err.message); 
      });
  });
}

function getAllThemes(){
  return new Promise((resolve,reject)=> {
    Theme.findAll()
      .then((themes)=>{
        resolve(themes);
      })
      .catch((err)=>{
        reject(err);
      })  
  });
}

function editSet(setData) {
  return new Promise((resolve, reject) => {
    Set.update(
      {
        name: setData.name,
        year: setData.year,
        num_parts: setData.num_parts,
        theme_id: setData.theme_id,
        img_url: setData.img_url
      },
      {
        where: { set_num: setData.set_num }
      }
    )
      .then((result) => {
        if (result[0] > 0) {
          resolve();
        } else {
          reject("Set not found");
        }
      })
      .catch((err) => {
        reject(err.errors[0].message );
      });
  });
}

function deleteSet(set_num){
  return new Promise((resolve, reject) => {
    Set.destroy(
      {
        where: { set_num: set_num }
      }
    )
      .then(() => {
          resolve();
      })
      .catch((err) => {
        reject(err.errors[0].message);
      });
  });

}

module.exports = { Initialize, getAllSets, getSetByNum, getSetsByTheme,addSet,getAllThemes,editSet,deleteSet}


sequelize.sync()
  .then(() => {
    console.log('Models synced with database');
  })
  .catch((error) => {
    console.error('Unable to sync models:', error);
  });

// Code Snippet to insert existing data from Set / Themes

// sequelize.sync()
//   .then( async () => {
//     try{
//       await theme.bulkCreate(themeData);
//       await set.bulkCreate(setData); 
//       console.log("-----");
//       console.log("data inserted successfully");
//     }catch(err){
//       console.log("-----");
//       console.log(err.message);

//       // NOTE: If you receive the error:

//       // insert or update on table "Sets" violates foreign key constraint "Sets_theme_id_fkey"

//       // it is because you have a "set" in your collection that has a "theme_id" that does not exist in the "themeData".   

//       // To fix this, use PgAdmin to delete the newly created "Themes" and "Sets" tables, fix the error in your .json files and re-run this code
//     }

//     process.exit();
//   })
//   .catch((err) => {
//     console.log('Unable to connect to the database:', err);
//   });