import mongoose from "mongoose";

const laborSchema = new mongoose.Schema({

    Year: { type: Number, required: true },
    lfpr_Rate: { type: Number, required: true },
    employ_Rate: { type: Number, required: true },
    unemploy_Rate: { type: Number, required: true }
});

const labor = mongoose.models.labor || mongoose.model('labor', laborSchema, 'labor_data');
export default labor;