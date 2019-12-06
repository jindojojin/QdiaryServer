const url = require("../controllers/key").mongodb;
var mongoClient = require("mongodb").MongoClient;
const database_name="qdiary";
var ObjectId = require("mongodb").ObjectID;
var dbmodel = {
    insert: async function (table_name, object) {
        let client = await mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true });
        let db = client.db(`${database_name}`);
        try {
            let a = await db.collection(`${table_name}`).insertOne(object);
            return Promise.resolve(a.insertedId);
        } catch (error) {
            return Promise.reject(error);
        } finally {
            client.close();
        }
    },
    delete: async function(table_name,deleteQuery){
        let client = await mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true });
        let db = client.db(`${database_name}`);
        try {
            // let query = { _id: { $in: [ObjectID, new ObjectId(ObjectID)] } };
            await db.collection(`${table_name}`).deleteOne(deleteQuery);
            return Promise.resolve("success");
        } catch (error) {
            return Promise.reject(error);
        } finally {
            client.close();
        }
    },
    update: async function(table_name,updateQuery,updatedObject){
        let client = await mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true });
        let db = client.db(`${database_name}`);
        try {
            // let query = { _id: { $in: [ObjectID, new ObjectId(ObjectID)] } };
            var newvalues = { $set:updatedObject };
            await db.collection(`${table_name}`).updateOne(updateQuery,newvalues);
            return Promise.resolve("success");
        } catch (error) {
            return Promise.reject(error);
        } finally {
            client.close();
        }
    },
    getOne: async function(table_name,ObjectID){
        let client = await mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true });
        let db = client.db(`${database_name}`);
        try {
            let query = { _id: { $in: [ObjectID, new ObjectId(ObjectID)] } };
            let a = await db.collection(`${table_name}`).findOne(query);
            return Promise.resolve(a);
        } catch (error) {
            return Promise.reject(error);
        } finally {
            client.close();
        }
    },
    getMany: async function (table_name,query,skip=0,limit=30,sortOptionObject={_id:-1}){
        let client = await mongoClient.connect(url, { useNewUrlParser: true,useUnifiedTopology: true });
        let db = client.db(`${database_name}`);
        try {
            let a = await db.collection(`${table_name}`).find(query).skip(skip).limit(limit).sort(sortOptionObject).toArray();
            return Promise.resolve(a);
        } catch (error) {
            return Promise.reject(error);
        } finally {
            client.close();
        }
    }

}
module.exports = dbmodel;
// dbmodel.insert("posts",{userID:"ádfsdfasdfsadfdfsa",title:"Ahihih đồ ngốc"}).then(r=> console.log(r)).catch(e=> console.log(e));
// dbmodel.delete("posts","5de4d3ac4238bb1a8cc19010").then(r=> console.log(r)).catch(e=> console.log(e));
// dbmodel.update("posts","5de4d392e11d8c1678202aa3",{title:"title đã thay đổi"}).then(r=> console.log(r)).catch(e=> console.log(e));
// dbmodel.getOne("posts","5de4d392e11d8c1678202aa3").then(r=> console.log(r)).catch(e=> console.log(e));
// dbmodel.getMany("posts",{},3,10).then(r=> console.log(r)).catch(e=> console.log(e));
