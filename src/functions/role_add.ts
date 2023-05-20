import * as admin from "firebase-admin";

export const addRole = async (uid, role) => {
    await admin.auth().getUser(uid).then(async (userRecord) => {
        if (userRecord.customClaims.roles.includes(role)) {
            console.log('this user is already a ' + role)
        }
        else {
            // adds role to users
            const uid = userRecord.uid;
            const arr = userRecord.customClaims.roles;
            await arr.push(role);
            await admin.auth().setCustomUserClaims(uid, { roles: arr })
            await console.log('role added')
        }
    });
}