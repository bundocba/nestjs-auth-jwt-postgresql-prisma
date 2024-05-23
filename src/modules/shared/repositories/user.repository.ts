import { Injectable } from '@nestjs/common'
import {BaseRepository} from "@common/bases";

@Injectable()
export class UserRepository extends BaseRepository {
    create = this.client.user.create;
    update = this.client.user.update;
    findOne = this.client.user.findFirst;
    find = this.client.user.findMany;
    count = this.client.user.count;

    async getByEmail(email: string, flag : boolean | undefined) {
        return await this.findOne({
            where: {
                email: email,
                isActive: flag,
            },
        })
    }

    async getById(id: number){
        return await this.client.user.findUnique({
            where: { id },
        });
    }
}
