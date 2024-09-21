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
        // Add any additional operations with the database here, if needed

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

        // Increment the Number_of_times_played field
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
// let result=stu.find(given);
        // let final=await result.toArray();
        // let insertedId=none;
        // console.log(`Found ${final.length} matching records`);
        // if (final.length===0){
        //     let doc=await stu.insertOne(given);
        //     console.log("New data, added into the database:");
        //     const insertedId = doc.insertedId;
        //     console.log("Inserted document ID:",insertedId);
        //     const games = { List_of_games: []};
        //     let game_list = await stu.updateOne(
        //         { _id: insertedId }, 
        //         { $set: games }     
        //     );
        //     console.log("Updated the inserted document with games list");
            
        // }
        // if (insertedId===none){
        //     doc=final[0]
        // }
        // if (doc.find({ List_of_games: { $in: {game_name: "g1"} } }).toArray()===0){
        //     let game_uodata=await stu.update
        // }
        // try{
        //     await connectToDatabase()
        //     console.log("Conected to database successfully");
        //     const filter = { Student_name: given.Student_name, game_name: given.game_name };
        //     let add=stu.updateOne(filter,{$set:given},{upsert:true});
        //     console.log(add);
        //     const insertedId = add.upsertedId ? add.upsertedId._id : (await stu.findOne(filter))._id; 
        //     let result= await stu.find({List_of_games:{ $exists: true }}).toArray();
        //     console.log(`Found ${result.length} matching records`);
        //     if(result.length===0){
        //         await stu.updateOne(
        //             { _id: insertedId }, 
        //             { $set: {List_of_games:[]} },   
        //         );
        //     }
        //     let exi=await add.find({List_of_games:{Game_name: "g1"}}).toArray();
        //     if (exi.length()===0){
        //         id=new MongoClient.ObjectId()
        //         const re=await stu.updateOne(
        //             {_id:insertedId},
        //             { $push:{List_of_games:{_id: id,Game_Name:"g1",Number_of_times_played:0}}}
        //         );
        //     }
        //     else{
        //         id=exi[0]._id;
        //     }
        //     await stu.updateOne(
        //         {_id:new ObjectId(insertedId),"List_of_games._id":new ObjectId(id)},
        //         {$set:{"List_of_games.$.Number_of_times_played":{$inc:1}}}
        //     )
        // }catch (err) {
        //     console.error(`Error connecting to the database: ${err}`);
        // }