const {default: mongoose} = require("mongoose")
const bcrypt = require("bcryptjs")


let userSchema = new mongoose.Schema({
    signFirst: {type: String, required:true},
    signLast: {type: String, required:true},
    signEmail: {type: String, required:true, unique: true},
    signPass: {type: String, required:true},

})

userSchema.pre("save", function(next){
    bcrypt.hash(this.signPass, 10).then((hashedPassword)=>{
        this.signPass = hashedPassword
        console.log(hashedPassword);
        next()
    }
    ).catch((err)=>console.log(err))
})

userSchema.methods.comparedPassword = function(userPassword, callback){
    bcrypt.compare(userPassword, this.signPass, (err, isMatch)=>{
        console.log(isMatch);
        if (err) {
            return callback(err)
            
        }
        else{
            if (!isMatch) {
                return callback(null, isMatch)
                
            }
            else{
                return callback(null, this)
            }
        }
    })
}

let user = mongoose.model("user", userSchema)

module.exports = user


