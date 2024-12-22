from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    # Serve index.html file
    return render_template('index.html')

@app.route('/configuration')
def configuration():
    # Serve builder.html dinamic page
    return render_template('configuration.html')

if __name__ == '__main__':
    app.run(debug=True)
