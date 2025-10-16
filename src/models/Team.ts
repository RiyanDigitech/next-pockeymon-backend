import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  pokemons: [{ type: String }], // Only Pokémon names
}, { timestamps: true });

teamSchema.index({ userId: 1, name: 1 }, { unique: true }); // Unique team name per user

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export default Team;