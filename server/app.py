from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # Servi il file index.html
    return render_template('index.html')

@app.route('/configuration')
def configuration():
    # Servi la pagina dinamica configuration.html
    return render_template('configuration.html')

if __name__ == '__main__':
    app.run(debug=True)
