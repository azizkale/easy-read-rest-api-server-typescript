import { getDatabase, ref, set } from "firebase/database";
import { Book } from "./Book";
import * as admin from "firebase-admin";
import { addGroupToUser } from "../functions/addGroupToUser";

export class User {
    userName: string;
    email: string;
    password: string;
    role: number;
    books: [Book]

    constructor(username: string, email: string, password: string, role: number) {
        this.userName = username
        this.email = email
        this.password = password
        this.role = role
    }

    retrieveAllUsers = async () => {
        // let users: any[] = []
        // return await admin.auth().listUsers()
        //     .then(async (userRecords: any) => {
        //         userRecords.users.map((userInfo) => {
        //             let user = {
        //                 displayName: userInfo.displayName,
        //                 uid: userInfo.uid
        //             }
        //             users.push(user)
        //         })
        //     })
        //     .catch((error) => {
        //         console.log('Error fetching user data:', error);
        //     });
    }

    retrieveEditorByEditorId = async (editorId: any) => {
        return await admin.auth().getUser(editorId)
            .then(async (userRecords: any) => {
                return {
                    displayName: userRecords.displayName,
                    uid: userRecords.uid
                }
            }).catch(error => {
                return { error: error.message }
            })
    }

    addRoleToUser = async (userId: any, role: string) => {
        await admin.auth().getUser(userId).then(async (userRecord) => {
            if (userRecord.customClaims.roles.includes(role)) {
                console.log('this user is already a ' + role)
                return { response: 'this user is already a ' + role }
            }
            else {
                // adds role to users
                const uid = userRecord.uid;
                const arr = userRecord.customClaims.roles;
                await arr.push(role);
                await admin.auth().setCustomUserClaims(uid, { roles: arr })
                return { response: arr }
            }
        });
    }

    retrieveUserByEmail = async (email: any) => {
        return admin.auth().getUserByEmail(email).then(userRecord => {
            return userRecord
        }).catch(error => {
            return { error: error.message }
        })
    }

    addParticipantToGroup = async (groupId: any, email: any, role: string) => {
        const db = getDatabase();

        const newParticipant = {
            role: role,
            email: email,
        }
        // retrieve group
        return admin.database().ref(`groups/${groupId}/users/`)
            .once('value', async (snapshot) => {

                //if there is an user-array already
                const arrParticipants = await snapshot.val() || [];

                //controlling if the array has the users already
                const isIncluded = arrParticipants?.some((obj) => {
                    return obj.email === newParticipant.email && obj.role === newParticipant.role;
                });

                if (isIncluded) {
                    return (`${newParticipant} exists in the array `);
                } else {
                    await arrParticipants.push(newParticipant)
                    //adding participant to group
                    await set(ref(db, `groups/${groupId}/users/`),
                        arrParticipants
                    );
                    //adding group to user
                    await admin.auth().getUserByEmail(email).then((userRecord) => {
                        addGroupToUser(userRecord.uid, groupId, role)
                    }).catch((error) => {
                        return { error: error.message }
                    })


                    return await arrParticipants
                }

            }, (error) => {
                return { error: error }
            });

    }


}