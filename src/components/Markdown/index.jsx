import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import { Editor } from '@toast-ui/react-editor'
const Markdown = () => {
  return (
    <Editor
      initialValue="hello Sistem Informasi Ternak!"
      previewStyle="vertical"
      height="600px"
      initialEditType="markdown"
      useCommandShortcut={true}
    />
  )
}

export default Markdown
