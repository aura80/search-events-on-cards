module.exports = {
  transformers: {
    "*.css": [
      "@parcel/transformer-css",
      {
        modules: true,
        plugins: ["cssnano"],
      },
    ],
  },
};
