import mongoose from "mongoose";

const gdpSchema = new mongoose.Schema({
  type: { type: String, required: true }, // To match the 'Gross Domestic Product' field type
  At_Current_Prices: {
    "2018-2019": { type: Number },
    "2019-2020": { type: Number },
    "2020-2021": { type: Number },
    "2021-2022": { type: Number },
    "2022-2023": { type: Number },
  },
  At_Constant_Prices: {
    "2018-2019": { type: Number },
    "2019-2020": { type: Number },
    "2020-2021": { type: Number },
    "2021-2022": { type: Number },
    "2022-2023": { type: Number },
  }
});

const gdp = mongoose.models.gdp || mongoose.model('gdp', gdpSchema, 'gdp_data');
export default gdp;
