import { useSQLiteContext } from "expo-sqlite";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';


export const loadData = async (db:any) => {

    const result = await db.getAllAsync(`SELECT * FROM users;`);
    console.log("Fectched Users: ",result)

}

export async function checkExists(name:string,db:any): Promise<boolean> {

    try{

        const result = await db.getAllAsync<{count: number}>(

            `SELECT COUNT(*) as count FROM users WHERE name = ?;`, [name]
    
        );

        return result[0].count > 0;

    } catch(error) {

        console.error(error)
        return false;
    }

    
}

async function hashPassword(password: string): Promise<string> {

    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
}

export async function registerUser(name:string,password:string,image:string,db:any) {

    console.log("REISTER USER CALLED")
    console.log(`registerUser, Recived: ${name} - ${password} - ${image}` )

    try{

        const hashedPassword = await hashPassword(password);

        await db.runAsync(`INSERT INTO users (name,password,image) VALUES (?,?,?)`,[name,hashedPassword,image]);
        console.log("registerUser Ran successfully");
        alert("User Registered Sucessfully")

        const users = await db.getAllAsync("SELECT * FROM users");
        console.log("All users:", users);



    }catch(error){

        console.error(error)

    }
    
}


export const deleteUserFolder = async (userName: string) => {

    const userDir = `${FileSystem.documentDirectory}users/${userName}/`;

    try {

      await FileSystem.deleteAsync(userDir, { idempotent: true });
      console.log(`Deleted folder for ${userName}`);

    } catch (error) {

      console.error(`Failed to delete folder for ${userName}:`, error);

    }
};

export async function deleteUser(userId: number,userName:string, db: any) {
    console.log("----DELETE USER----");
    console.log(`Received: userId = ${userId}`);
  
    try {
      
      await db.runAsync("BEGIN TRANSACTION");
  
      await db.runAsync("DELETE FROM notes WHERE userId = ?", [userId]);
      console.log(`Notes for userId ${userId} deleted`);
  
      await db.runAsync("DELETE FROM users WHERE id = ?", [userId]);
      console.log(`User ${userId} deleted`);
  
      await db.runAsync("COMMIT");

      await deleteUserFolder(userName);
  
    } catch (error) {
      
      await db.runAsync("ROLLBACK");
      console.error("deleteUser ERROR: ", error);
      throw error;
    
    }

}



export async function validateCredentials(name:string,password:string,db:any): Promise<boolean> {
    

    const hashed = await hashPassword(password);
    
    try{
        const result = await db.getAllAsync(
            `SELECT * FROM users WHERE name = ? AND password = ?`, [name, hashed]
        );
        return result.length > 0;

    } catch(error) {

        console.error(error)
        return false;

    }
}

export const getProfilePicture = async (name:string, db:any) => {

    try{

        const imagePath = await db.getAllAsync(`SELECT image FROM users WHERE name = ?`,[name]);
        console.log("Image Path: ",imagePath)
        return imagePath?.[0]?.image || null;
        

    }catch(error){

        console.error("getProfilePicture: ", error)
        return "pfp not found / Error";

    }

}

export const getUserId = async (name:string,db:any): Promise<number | null> => {

    console.log("=====GET USER ID=========")
    try {
        
        const result = await db.getAllAsync(
            `SELECT id FROM users WHERE name = ?`, [name]
        );

        console.log(result);
        
        if (result.length > 0) {

            return result[0].id; 

        } else {

            console.log('User not found');
            return null;
        }
    } catch (error) {

        console.error("Error fetching user ID: ", error);
        return null;

    }
}



export const saveUserSession = async (userName: string, userId:number) => {

    try {
        
        console.log(`saveUserSession recived: `, userName, " and ", userId)

        const session = JSON.stringify({ userName, userId });

        await SecureStore.setItemAsync('userSession', session);
        console.log('User session saved: ', session);

    } catch (error) {

        console.error('saveUserSession error: ', error);
    }

};

export const getCurrentUser = async () => {

    try {

        const sessionString = await SecureStore.getItemAsync('userSession');
        if (!sessionString) return null;

        console.log("getCurrentUser Logs: ",sessionString);
        return JSON.parse(sessionString); // returns { userName, userId }

    } catch (error) {

        console.error('Error getUserSession: ', error);
        return null;
    }
}
  

export const clearUserSession = async () => {

    console.log("=====Try ClearUser=====")

    try {

      await SecureStore.deleteItemAsync('userSession');
      console.log('User session cleared');

    } catch (error) {

      console.error('clearUserSession error: ', error);

    }
};
  
export const addToRecentUsers = async (userId: number, userName: string) => {
    try {
      const recentUsersString = await AsyncStorage.getItem('recentUsers');
      let recentUsers = recentUsersString ? JSON.parse(recentUsersString) : [];
  
      
      recentUsers = recentUsers.filter((user: any) => user.userId !== userId);
  
    
      recentUsers.unshift({ userId, userName });
  
      // Limit to  3 users
      if (recentUsers.length > 3) {
        recentUsers = recentUsers.slice(0, 3);
      }
  
      await AsyncStorage.setItem('recentUsers', JSON.stringify(recentUsers));
      console.log('Recent users updated:', recentUsers);
  
    } catch (error) {

      console.error('addToRecentUsers ERROR:', error);
    }
  };
  

  export const getRecentUsers = async () => {
    try {

      const recentUsersString = await AsyncStorage.getItem('recentUsers');

      if (!recentUsersString) return [];
      return JSON.parse(recentUsersString);

    } catch (error) {
        
      console.error('getRecentUsers error:', error);
      return [];
    }
  };

  export const deleteFromRecentUsers = async (userId: number) => {
    try {
      const recentUsersString = await AsyncStorage.getItem('recentUsers');
      
      
      if (!recentUsersString) {
        console.log('No recent users to delete from');
        return;
      }
      

      let recentUsers = JSON.parse(recentUsersString);
      
      // Check if user exists before filtering
      const userExists = recentUsers.some((user: any) => user.userId === userId);
      
      if (!userExists) {
        console.log(`User with ID ${userId} not found in recent users`);
        return;
      }
      
      const updatedRecentUsers = recentUsers.filter((user: any) => user.userId !== userId);
      
    
      await AsyncStorage.setItem('recentUsers', JSON.stringify(updatedRecentUsers));
      console.log(`User with ID ${userId} removed from recent users`);
      console.log('Updated recent users:', updatedRecentUsers);
      
      return updatedRecentUsers;
    } catch (error) {
      console.error('deleteFromRecentUsers ERROR:', error);
      throw error;
    }
  };
  