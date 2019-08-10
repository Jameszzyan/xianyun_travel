import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor/dist/ssr'
Vue.use(VueQuillEditor)

// editorOption: {
//     // some quill options
//     modules: {
//       toolbar: {
//         container: [
//           ['bold', 'italic', 'underline', 'strike'],
//           ['blockquote', 'code-block'],
//           ['image']
//         ],
//         handlers: {
//           'image': function () {
//             // 意思是使用插入图片的功能时候，触发文件上传控件的点击事件
//             document.getElementById('getFile').click();
//           }
//         }
//       }
//     }
