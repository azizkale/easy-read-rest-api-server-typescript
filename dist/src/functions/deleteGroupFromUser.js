"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGroupFromUsers = void 0;
const admin = __importStar(require("firebase-admin"));
const deleteGroupFromUsers = async (groupId) => {
    const usersOfTheGroup = await admin.database().ref(`groups/${groupId}/users`);
    return usersOfTheGroup.once('value', async (snapshot) => {
        if (snapshot.exists()) {
            // access all users of the group
            const data = snapshot.val();
            //getting user's IDs 
            const arrUsersId = Object.keys(data);
            //removes the group from all users of the froup the node '`users/${userId}/groups/${groupId}`'
            await arrUsersId.map(async (userId) => {
                const nodeRef = await admin.database().ref(`users/${userId}/groups/`);
                return await nodeRef.child(groupId).remove();
            });
        }
        else {
            return null;
        }
    }, (error) => {
        return { error: error };
    });
};
exports.deleteGroupFromUsers = deleteGroupFromUsers;
