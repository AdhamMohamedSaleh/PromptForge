import { connectToDB } from "@/utils/db";
import Prompt from "@/models/prompt";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const { id } = await params;

    const prompts = await Prompt.find({ creator: id }).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch user prompts", { status: 500 });
  }
};
