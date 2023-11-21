import classNames from 'classnames'
import hljs from 'highlight.js'
import fileIcon from './FileTree/icons8-file.svg?url'

const ICON_SIZE = 20

export default function CodeFile({ filename, content, language, className }) {
    return (
        <div className={classNames("flex flex-col max-w-full overflow-x-hidden bg-gray-200 p-2 text-sm", className)}>
            {filename && filename.length > 0 && (
                <div className="flex items-center mb-2 py-1 border-b border-gray-300">
                    <img
                        src={fileIcon}
                        style={{
                            width: ICON_SIZE,
                            height: ICON_SIZE,
                            padding: '2px 0',
                        }}
                    />
                    <span className="ml-1">{filename}</span>
                </div>
            )}
            <pre>
                <code
                    dangerouslySetInnerHTML={{
                        __html: hljs.highlight(content, { language }).value,
                    }}
                />
            </pre>
        </div>
    )
}
