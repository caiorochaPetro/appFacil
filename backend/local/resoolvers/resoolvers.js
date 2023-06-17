import {user} from '../models/models.js';

async function seqUser(id) {
    const gUser = await user.findOne({
        where: {id}
    });
    return gUser;
} 


export const resolvers = {
    Query: {
        async usuario(id){
            return await seqUser(_,id);       
        }
    },
    Mutation:{

    }
}