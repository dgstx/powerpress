import { Table, Column, CreatedAt, UpdatedAt, Model, PrimaryKey, AutoIncrement, AllowNull, Unique, BelongsToMany } from "sequelize-typescript";
import User from "./User";
import UserQueue from "./UserQueue";
import Whatsapp from "./Whatsapp";
import WhatsappQueue from "./WhatsappQueue";

@Table
class Queue extends Model<Queue> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @AllowNull(false)
  @Unique
  @Column
  color: string;

  @Column
  greetingMessage: string;

  @Column
  startWorkMorning: string; // Novo campo para início do turno da manhã

  @Column
  endWorkMorning: string; // Novo campo para fim do turno da manhã

  @Column
  startWorkAfternoon: string; // Novo campo para início do turno da tarde

  @Column
  endWorkAfternoon: string; // Novo campo para fim do turno da tarde

  @Column
  absenceMessage: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsToMany(() => Whatsapp, () => WhatsappQueue)
  whatsapps: Array<Whatsapp & { WhatsappQueue: WhatsappQueue }>;

  @BelongsToMany(() => User, () => UserQueue)
  users: Array<User & { UserQueue: UserQueue }>;
}

export default Queue;