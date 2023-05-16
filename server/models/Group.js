const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { dbLogger } = require("../logs/logger");
const createBlobStorage = require("../utils/createBlobStorage");

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  ],
  blobId: {
    type: String,
  },
  // unsure about whether this will be needed at this stage
  /*   password: {
    type: String,
    required: true,
    len: [8, 50],
  }, */
});

groupSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      this.blobId = await createBlobStorageContainer(this.name);
    } catch (err) {
      dbLogger.error(JSON.stringify({ err }));
    }
  }
});

/* groupSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

groupSchema.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};
 */
const Group = model("Group", groupSchema);

module.exports = Group;
