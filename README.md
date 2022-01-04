# ELDROW

`not ios_saf < 13` is in the `browserslist` of this project because it seems like `styled-components` has an issue when compiled in the current version of Parcel. Adding this browserlist option resolved the issue.
I found this solution in [this Github issue](https://github.com/parcel-bundler/parcel/issues/7101).
