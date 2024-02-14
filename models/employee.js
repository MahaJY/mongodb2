const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema
const usernameValidator = (value) => {
    const pattern = /^[a-zA-Z0-9_]{3,20}$/;
    return pattern.test(value); 
  };
  const personaldetailsschema = new Schema({
    DOB:{
      type:Date,
      required:true
    },
    address:{
      type:String,
      required:true
    },
    phoneNo:{
      type:Number,
      required:true
    }
  })
const employeeSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    designation:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    age:{
        type: Number,
        required:true
    },
    username: {
        type: String,
        required: true, 
        unique: true, 
        validate: {
        validator: usernameValidator, 
        message: 'Username must be between 3 and 20 characters long and contain only letters, numbers, or underscores' 
        }
      },
    password: {
        type: String,
        required:true
    },
    role:{
        type: String,
        required:true
    },
    personaldetails:[personaldetailsschema]
       
},{
    timestamps:true
})

const employee = mongoose.model('Employee',employeeSchema);

employeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      return next();
    }
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  });
  employeeSchema.statics.findByusername = async function(username) {
   return this.find({ username });
  }
  //employeeSchema.virtual('idandusername').get(function() {
   // return {id: this._id, username: this.username };
 // });
  employeeSchema.query.byRole = function(role) {
    return this.where({ role });
};
employeeSchema.post('deleteOne', function(doc) {
  console.log('%s has been deleted', doc._id);
});
    
module.exports = employee