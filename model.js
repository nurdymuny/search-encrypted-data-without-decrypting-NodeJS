var mongoose = require("mongoose");
var mongoosastic = require("mongoosastic");
const mongooseFieldEncryption = require("mongoose-field-encryption")
  .fieldEncryption;

var Schema = mongoose.Schema;
mongoose.connect(
  "mongodb://localhost:27017/medicalRecords",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (err) {
    if (err) {
      console.error(err);
    }
    console.log("connected.... unless you see an error the line before this!");
  }
);

var bookSchema = new Schema({
  Age: String,
  Gender: String,
  Total_Bilirubin: String,
  Direct_Bilirubin: String,
  Alkaline_Phosphotase: String,
  Alamine_Aminotransferase: String,
  Aspartate_Aminotransferase: String,
  Total_Protiens: String,
  Albumin: String,
  Albumin_and_Globulin_Ratio: String,
  Dataset: String,
});

bookSchema.plugin(mongooseFieldEncryption, {
  fields: [
    "Total_Bilirubin",
    "Direct_Bilirubin",
    "Alkaline_Phosphotase",
    "Alamine_Aminotransferase",
    "Aspartate_Aminotransferase",
    "Total_Protiens",
    "Albumin",
    "Albumin_and_Globulin_Ratio",
  ],
  secret: "2304982094u203480jlkfgsd;lkfjsd;lkfjsd;lk",
  saltGenerator: function (secret) {
    return "1234567890123456"; // should ideally use the secret to return a string of length 16
  },
});

bookSchema.plugin(mongoosastic);

var Patients = mongoose.model("patients", bookSchema);

module.exports = Patients;
