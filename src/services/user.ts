import {User} from "../db/entity/User";
import {IUser} from "../views";
import {getRepository} from "typeorm";

export const createUser = async (data: IUser): Promise<IUser> => {
        const user = await getRepository(User).create(data);

        const result = await getRepository(User).save(user);

        return result;
};

export const getUserByLogin = async (login: string): Promise<IUser | null> => {
        const user = await getRepository(User).findOne({
            where: {
                login,
            },
        });

        if (!user) return null;

        return user;
};