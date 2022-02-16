import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field(() => String)
  password: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  user(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    return em.findOne(User, { id });
  }

  @Query(() => User, { nullable: true })
  userByUsername(
    @Arg("username", () => String) username: string,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    return em.findOne(User, { username: username });
  }

  @Mutation(() => User)
  async createUser(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<User> {
    const user = new User(options.username, options.password);
    await em.persistAndFlush([user]);
    return user;
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("id", () => Int) id: number,
    @Arg("password", () => String) password: string,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    const user = await em.findOne(User, { id });
    if (user) {
      user.password = password;
      await em.persistAndFlush([user]);
      return user;
    }

    return null;
  }

  @Mutation(() => Boolean, { nullable: true })
  async deleteUser(
    @Arg("id", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Boolean | null> {
    const user = await em.findOne(User, { id });
    if (!user) {
      return null;
    }
    await em.nativeDelete(User, { id });
    return true;
  }
}
