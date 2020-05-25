# water-is-ready

An attempt to learn a bit more about tensorflow.
Checks a cam RTSP feed looking for people and logs it when found.
Uses the pre-build model 'Pascal' from `@tensorflow-models/deeplab`

### Install

- Requires Node 12
- Rename `.env.example` to `.env` and fill the parameters

Also, after installing the project, it's necessary to modify the following file:`~\node_modules\@tensorflow\tfjs-converter\dist\executor\graph_executor.js` on line 463 to:

`tfjs_core_1.util.assert(input.dtype === node.attrParams['dtype'].value || input.dtype === 'float32', function () { return "The dtype of dict['" + node.name + "'] provided in " + " +`
