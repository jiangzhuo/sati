import { Entity, Column, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class User {
    @ObjectIdColumn() id: ObjectID;

    @Column() mobile: string;

    @Column() nickname: string;

    @Column() password: string;

    @Column() status: number;

    @Column() updateTime: number;
}
