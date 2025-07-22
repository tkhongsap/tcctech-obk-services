import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { Editor, FileLoader, UploadAdapter, EventInfo } from 'ckeditor5'

import { s3Uploader } from 'utils/s3'
import { convertToBase64 } from '@src/utils/image'
import { last } from 'lodash'
import { useRef } from 'react'

function CustomEditor({ data, onChange, error }: any) {
  const isFocus = useRef(false)
  function uploadAdapter(loader: FileLoader): UploadAdapter {
    return {
      upload: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const file = await loader.file
            if (!file) {
              throw new Error('File not found')
            }

            const ext = file.name.split('.').pop()
            const name = new Date().getTime().toString() + '.' + ext
            const type = file.type

            if (file) {
              convertToBase64(file)
                .then((base64) => {
                  const base64Data = last(base64?.toString().split('base64,'))!
                  return base64Data
                })
                .then(async (response) => {
                  const data = await s3Uploader(response, name, type)
                  resolve({
                    default: data.imageUrl,
                  })
                })
                .catch((error) => {
                  console.log(error)
                })
            }
          } catch (error) {
            reject(error)
          }
        })
      },
      abort: () => {
        console.error('Upload aborted')
      },
    }
  }

  function uploadPlugin(editor: Editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (
      loader: FileLoader
    ) => {
      return uploadAdapter(loader)
    }
  }

  return (
    <div className={error ? 'border-1 border-red-500' : ''}>
      <CKEditor
        data={data}
        onChange={(event: EventInfo, editor: ClassicEditor) => {
          const data = editor.getData()
          if (isFocus.current) {
            onChange(data)
          }
        }}
        onBlur={(_, editor: ClassicEditor) => {
          const content = editor.getData()
          onChange(content)
        }}
        onFocus={() => {
          isFocus.current = true
        }}
        editor={ClassicEditor}
        config={{
          extraPlugins: [uploadPlugin],
          toolbar: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'bold',
            'italic',
            '|',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'indent',
            'outdent',
            '|',
            'imageUpload',
          ],
          image: {
            toolbar: [],
          },
        }}
      />
    </div>
  )
}

export default CustomEditor
