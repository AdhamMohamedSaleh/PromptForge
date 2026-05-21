import mongoose, { Schema, model, models, Model } from "mongoose";

export interface IPrompt {
  creator?: mongoose.Types.ObjectId;
  prompt: string;
  tag: string;
}

const PromptSchema = new Schema<IPrompt>({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required"],
  },
  tag: { type: String, required: [true, "Tag is required"] },
});

const Prompt =
  (models.Prompt as Model<IPrompt>) || model<IPrompt>("Prompt", PromptSchema);

export default Prompt;
