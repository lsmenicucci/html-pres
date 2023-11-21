import fileIcon from './icons8-file.svg?url'
import folderIcon from './icons8-folder.svg?url'

// render file tree using the following inpurt format
// file: { type: 'file', name: 'index.jsx' }
// folder: { type: 'folder', name: 'lib', children: [...] }

const ICON_SIZE = 20
const IDENT_SIZE = 20

const filterChildren = (children, maxChildren) => {
    if (maxChildren === -1) return children

    const stop = Math.round(maxChildren / 2)
    const startAgain = children.length - stop

    const first = children.slice(0, stop)
    const last = children.slice(startAgain)

    return [...first, { type: 'annotation', name: '...' }, ...last]
}

export const singleFile = (name) => ({ type: 'file', name })

const FileTree = ({ tree, depth = 0, maxChildren = -1, base = '' }) => {
    return (
        <div
            className="flex flex-col text-xs"
            style={{ marginLeft: depth * IDENT_SIZE }}
        >
            {tree.map((item, idx) => {
                if (item.type === 'file') {
                    return (
                        <div key={idx} className="flex items-center">
                            {depth > 0 && (
                                <div
                                    style={{
                                        marginLeft: -IDENT_SIZE / 2,
                                        borderLeft: '0.1px solid #888',
                                        height: ICON_SIZE,
                                        marginRight: IDENT_SIZE / 2,
                                    }}
                                ></div>
                            )}
                            <img
                                src={fileIcon}
                                style={{
                                    width: ICON_SIZE,
                                    height: ICON_SIZE,
                                    padding: '2px 0',
                                }}
                            />
                            <span className="ml-1">{item.name}</span>
                        </div>
                    )
                } else if (item.type === 'annotation') {
                    return (
                        <div key={idx} className="flex items-center">
                            <div
                                style={{
                                    marginLeft: -IDENT_SIZE / 2,
                                    borderLeft: '0.1px solid #888',
                                    height: ICON_SIZE,
                                    marginRight: IDENT_SIZE / 2 + ICON_SIZE,
                                }}
                            ></div>
                            <span className="ml-1">{item.name}</span>
                        </div>
                    )
                } else {
                    return (
                        <div key={idx} className="flex flex-col">
                            <div className="flex items-center mb-1">
                                {depth > 0 && (
                                    <div
                                        style={{
                                            marginLeft: -IDENT_SIZE / 2,
                                            borderLeft: '0.1px solid #888',
                                            height: ICON_SIZE,
                                            marginRight: IDENT_SIZE / 2,
                                        }}
                                    ></div>
                                )}
                                <img
                                    src={folderIcon}
                                    style={{
                                        width: ICON_SIZE,
                                        height: ICON_SIZE,
                                        padding: '2px 0',
                                    }}
                                />
                                <span className="ml-1">{item.name}</span>
                            </div>
                            <FileTree
                                tree={filterChildren(
                                    item.children,
                                    item['show-max-children'] || maxChildren
                                )}
                                maxChildren={maxChildren}
                                depth={depth + 1}
                                base={base + '/' + item.name}
                            />
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default FileTree
