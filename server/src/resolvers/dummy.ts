import { MyContext } from "src/types";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class DummyResolver {
  @Query(() => String)
  dummy(@Ctx() { em }: MyContext): string {
    console.log(em);
    return JSON.stringify({ message: "hello omg world" });
  }
}
