import meta1 from "../meta/meta1.json";
import meta2 from "../meta/meta2.json";
import { setMetaFiles } from "../redux/metaSlice";

export const loadMetaFiles = (dispatch) => {
  return new Promise((resolve) => {
    const allMeta = [meta1, meta2]; // add all JSONs
    dispatch(setMetaFiles(allMeta));
    resolve(); // now returns a Promise
  });
};
