import { Resolver, Query } from "type-graphql";
import SegmentSchema from "./SegmentSchema";

@Resolver(of => SegmentSchema)
export default class SegmentResolver {
  @Query(returns => [SegmentSchema])
  async segments() {
    return [];
  }
}
