This demonstrates a potential problem with the file-loader plugin for webpack,
or at least my misunderstanding of how it should work.

There are two entry points for two features. Feature one includes a CSS file, which itself includes a logo.

When webpack runs over this code, the `logo.svg` file will be included in the `dist/` folder.

At the 'emit' phase of webpack, chunks can be inspected. A Chunk has a `files` property, which should list all files
involved in the chunk. When inspected, we can see that `feature-one.js` and `feature-one.css` are referenced,
but `logo.svg` is not. However, the chunk's "modules" can list the `fileDependencies` of itself, and this list
*does* include the (fully-qualified path) to the image.

Here's the webpack output of the example:

```
> yarn webpack
$ "<<checkout-dir>>/node_modules/.bin/webpack"
chunk info {
    "0": {
        "modules": {
            "2": {
                "filepaths": [
                    "<<checkout-dir>>/src/feature-two.js"
                ]
            },
            "3": {
                "filepaths": [
                    "<<checkout-dir>>/src/feature-two.css",
                    "<<checkout-dir>>/node_modules/css-loader/lib/css-base.js",
                    "<<checkout-dir>>/src/feature-two.css"
                ]
            }
        },
        "files": [
            "feature-two.js",
            "feature-two.css"
        ]
    },
    "1": {
        "modules": {
            "0": {
                "filepaths": [
                    "<<checkout-dir>>/src/feature-one.js"
                ]
            },
            "1": {
                "filepaths": [
                    "<<checkout-dir>>/src/feature-one.css",
                    "<<checkout-dir>>/node_modules/css-loader/lib/css-base.js",
                    "<<checkout-dir>>/src/feature-one.css",
                    "<<checkout-dir>>/src/logo.svg"
                ]
            }
        },
        "files": [
            "feature-one.js",
            "feature-one.css"
        ]
    }
}
Hash: 9d8603d6b25981dfd88f
Version: webpack 3.5.5
Time: 403ms
                               Asset       Size  Chunks             Chunk Names
2baa77d6015e6de6adf1ffa247530568.svg  679 bytes          [emitted]  
                      feature-two.js    3.01 kB       0  [emitted]  feature-two
                      feature-one.js    3.23 kB       1  [emitted]  feature-one
                     feature-one.css  136 bytes       1  [emitted]  feature-one
                     feature-two.css   50 bytes       0  [emitted]  feature-two
   [0] ./src/feature-one.js 142 bytes {1} [built]
   [1] ./src/feature-one.css 128 bytes {1} [built]
   [2] ./src/feature-two.js 28 bytes {0} [built]
   [3] ./src/feature-two.css 92 bytes {0} [built]
   [4] ./node_modules/css-loader?{"modules":true}!./src/feature-one.css 391 bytes [built]
   [6] ./src/logo.svg 82 bytes [built]
   [9] ./node_modules/css-loader?{"modules":true}!./src/feature-two.css 270 bytes [built]
    + 3 hidden modules
Child extract-text-webpack-plugin node_modules/extract-text-webpack-plugin/dist node_modules/css-loader/index.js??ref--0-2!src/feature-two.css:
       [0] ./node_modules/css-loader?{"modules":true}!./src/feature-two.css 270 bytes {0} [built]
        + 1 hidden module
Child extract-text-webpack-plugin node_modules/extract-text-webpack-plugin/dist node_modules/css-loader/index.js??ref--0-2!src/feature-one.css:
     1 asset
       [0] ./node_modules/css-loader?{"modules":true}!./src/feature-one.css 391 bytes {0} [built]
       [2] ./src/logo.svg 82 bytes {0} [built]
        + 1 hidden module
Done in 1.10s.
```

My expectation is that the `files` array for chunk #1 (i.e., feature-one) would include "logo.svg", but it doesn't.

I'm not sure what's the most reasonable or supported way of disovering that feature-one's dependency graph includes the "logo.svg" file, but
ultimately that's my goal -- to get a list of all the direct + transitive asset dependencies for a given entry-point or chunk.