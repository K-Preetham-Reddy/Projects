// app.js
import { MongoClient,ObjectId } from "mongodb";
import uri from "./atlas_uri.js";
import data from './output.json' assert { type: 'json' };
const client = new MongoClient(uri);
const dbname = "Analysis";
const student_collection="stu";
let stu,game;
let subdocId;
const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log(`Connected to the ${dbname} database`);
        stu=client.db(dbname).collection(student_collection);

    } catch (err) {
        console.error(`Error connecting to the database: ${err}`);
        throw err;
    }
};
const game_n={
    game_name:"g1"
}
const given={
    Student_name:"Preetham",
    Student_password:"password",
}

const student=async()=>{
    try {
        await connectToDatabase();
        console.log("Connected to database successfully");

        const filter = { Student_name: given.Student_name, Student_password: given.Student_password };
        const updateResult = await stu.updateOne(filter, { $set: given }, { upsert: true });

        const insertedId = (await stu.findOne(filter))._id;

        const result = await stu.findOne({ _id: insertedId }); 
        if(!result.List_of_games){
            await stu.updateOne({ _id: insertedId }, { $set: { List_of_games:[] } });
        }
        console.log("The list has been inserted");
        const updatedDoc=await stu.findOne({_id:insertedId});
        const existingSubdoc = updatedDoc.List_of_games.find(game => game.Game_Name === game_n.game_name);
        if (!existingSubdoc) {
            subdocId = new ObjectId();
            await stu.updateOne(
                { _id: insertedId },
                { $push: { List_of_games: { _id: subdocId, Game_Name: game_n.game_name, Number_of_times_played: 0 } } }
            );
        } else {
            subdocId = existingSubdoc._id;
        }
        await stu.updateOne(
            { _id: insertedId, "List_of_games._id": subdocId },
            { $inc: { "List_of_games.$.Number_of_times_played": 1 } }
        );

    } catch (err) {
        console.error(`Error processing the document: ${err}`);
    } 

    
};
const games=async()=>{
    try{
        console.log("Connected to Database successfully(2)");
        game=client.db(dbname).collection(game_n.game_name);
        console.log("The collection of the game has been connnected");
        const filter1={student_info:subdocId};
        const update_info=await game.updateOne(filter1,{$set:{student_info:subdocId}},{upsert:true});
        const ginsertedId = (await game.findOne(filter1))._id;
        const result1 = await game.findOne({ _id: ginsertedId });
        if(!result1.data_tenn){
            await game.updateOne({ _id: ginsertedId }, { $set: { data_tenn:[] } });
        }
        await game.updateOne(
            {_id:ginsertedId},
            {$push:{data_tenn:data}}
        );
        console.log("The data has been pushed")
        
    }catch(err){
        console.error(`Error processing the document: ${err}`)
    }finally{
        await client.close();
    }


}
await student();
await games();
