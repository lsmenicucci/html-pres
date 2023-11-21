from pathlib import Path
import json
import sys

here = Path(__file__).parent.resolve()
target = Path.cwd().resolve()

if len(sys.argv) > 1:
    target = Path(sys.argv[1]).resolve()


def crawl(path):
    if path.is_dir():
        content = [ crawl(p) for p in path.iterdir() ] 
        return { "type": "folder", "name": path.name, "children": content } 

    return { "type": "file", "name": path.name }


tree = crawl(target) 
print(json.dumps(tree, indent=2))
        
