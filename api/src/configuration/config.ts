export default () => {
  return {
    database: process.env.MONGO_URI,
    global: {
      uri: `${process.env.MONGO_URI}/global?authSource=admin`,
    },
  };
};
