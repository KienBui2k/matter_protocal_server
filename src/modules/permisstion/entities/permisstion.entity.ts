import { UserDevice } from 'src/modules/user_devive/entities/user_devive.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Permisstion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string

    @Column()
    node_id: number

    @ManyToOne(() => UserDevice, (user) => user.permiss)
    user_id: UserDevice;

}
