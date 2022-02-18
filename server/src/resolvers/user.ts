import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field(() => String)
  password: string;
}

@ObjectType()
class Error {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];

  @Field(() => User, { nullable: true })
  user?: User;
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

  @Mutation(() => UserResponse)
  async register(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = new User(options.username, hashedPassword);
    try {
      await em.persistAndFlush([user]);
    } catch (error) {
      if (error.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already exists",
            },
          ],
        };
      }

      return {
        errors: [
          {
            field: "error",
            message: error.message,
          },
        ],
      };
    }

    return {
      user: user,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options", () => UsernamePasswordInput) options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: `couldn't find a user with username ${options.username}`,
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);
    console.log(valid);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: `incorrect password`,
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user: user,
      errors: [],
    };
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Arg("id", () => Int) id: number,
    @Arg("password", () => String) password: string,
    @Ctx() { em }: MyContext
  ): Promise<User | null> {
    const user = await em.findOne(User, { id });
    if (user) {
      user.password = await argon2.hash(password);
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
