import mongoose from 'mongoose';

const batchesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    role:{
        type:String,
        required:true,
    },
    jobDescription:{
        type:String,
        required:true,
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Admin'
    }
});

const Batch = mongoose.model('Batch', batchesSchema);

export default Batch;


