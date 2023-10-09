import sys 
from pathlib import Path
import flask

replace_str = "<!-- presentation -->"

here = Path(__file__).parent 
cwd = Path.cwd()

template_dir = here / "template"
statics = ["style.css", "index.js"]

def render_page(page_path):
    page = Path(page_path).read_text()
    template = (template_dir / "index.html").read_text()

    return template.replace(replace_str, page)

app = flask.Flask(__name__)

@app.route("/")
@app.route("/<path:path>")
def index(path):
    page_path = cwd / path
    if page_path.is_dir():
        page_path = page_path / "index.html"

    if path in statics:
        static_path = template_dir / path
        return flask.send_from_directory(static_path.parent, static_path.name)

    if not page_path.exists():
        flask.abort(404)

    if page_path.suffix == ".html":
        return render_page(page_path)

    return flask.send_from_directory(page_path.parent, page_path.name)


if __name__ == "__main__":
    app.run(debug=True)
