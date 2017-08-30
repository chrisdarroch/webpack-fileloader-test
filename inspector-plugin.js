function MyPlugin() {}

MyPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    let chunkInfo = {};
    // Explore each chunk (build output):
    compilation.chunks.forEach(function(chunk) {
      let data = {};

      // Explore each module within the chunk (built inputs):
      data.modules = {};
      chunk.forEachModule(function(module) {

        // Explore each source file path that was included into the module:
        let filepaths = []
        module.fileDependencies.forEach(function(filepath) {
          filepaths.push(filepath);
        });

        data.modules[module.id] = { filepaths };
      });

      // Explore each asset filename generated by the chunk:
      data.files = [];
      chunk.files.forEach(function(filename) {
        data.files.push(filename);
      });

      chunkInfo[chunk.id] = data;
    });

    console.log('chunk info', JSON.stringify(chunkInfo, null, 4));

    callback();
  });
};

module.exports = MyPlugin;
