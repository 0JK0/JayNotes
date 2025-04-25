import { useSQLiteContext } from "expo-sqlite";

export async function saveNewNote(date:string,title:string,body:string,noteType:string,userId:number,db:any, ) {

    console.log("----Save New Note Starts---")
    console.log(`Recived: ${date} - ${title} - ${body} - ${userId}` )

    try{

        await db.runAsync(`INSERT INTO notes (date,title,body,noteType,userId) VALUES (?,?,?,?,?)`,[date,title,body,noteType,userId]);
        alert("Noted Saved Succefully")

        const notes = await db.getAllAsync("SELECT * FROM notes");
        console.log("All notes: ",notes);



    }catch(error){

        console.error("=== ERROR SaveNewNote: ",error)

    }
    
}


export async function getNotesFromUser(userId:number,db:any) {

    console.log("----get Notes From User---")
    console.log(`Recived: userId = ${userId}` )

    try {

        const notes = await db.getAllAsync(`SELECT * FROM notes WHERE userId = ? ORDER BY id DESC`,[userId]);
        console.log("Log of notes inside User Selected: " ,notes);
        
        return notes;

    } catch(error){

        console.error("getNotesFromUser ERROR: ", error)
        return[];


    }
    
}

export async function deleteNoteById(id: number, db: any) {

    console.log("----DELETE NOT BY ID---")
    console.log(`Recived: userId = ${id}` )

    try {

      await db.runAsync("DELETE FROM notes WHERE id = ?", [id]);
      console.log(`Note with ID ${id} deleted`);

    } catch (error) {

      console.error("deleteNoteById ERROR: ", error);

    }
}
  